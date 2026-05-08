#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const METRICS_JSON = 'metrics.json';
const TRAFFIC_JSON = 'traffic.json';

function readJSON(file) {
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(file + ' is not valid JSON file.');
    }
  }
  return { "visitor": 1, "uniques": 1, "history": [] };
}

function writeJSON(data) {
  fs.writeFileSync(METRICS_JSON, JSON.stringify(data, null, 2));
  console.log(`${METRICS_JSON} updated with ${data.history.length} days`);
}

function mergeHistory(exist, fetch) {
  const byDate = {}; // Use object for fast deduplication by date
  exist.history.forEach(entry => { byDate[entry.date] = entry; });
  fetch.views.forEach(entry => {
    if (entry.count > 0 || entry.uniques > 0) {
      byDate[entry.timestamp.slice(0, 10)] = {
        "date": entry.timestamp.slice(0, 10),
        "counter": entry.count,
        "uniques": entry.uniques
      };
    }
  });
  // Convert back to array and sort by date ascending
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
}

function abbreviated(number) {
  if (number < 1000) {
    return number;
  }
  return (number / 1000).toFixed(2) + 'K';
}

function updateReadmeBadge(visitor, uniques) {
  visitor = abbreviated(visitor);
  uniques = abbreviated(uniques);
  const updateDate = new Date().toISOString().split('T')[0];
  const badgeRegex = /<!-- START BADGE -->[\s\S]*?<!-- ENDED BADGE -->/g;
  const badgeBlock = `<!-- START BADGE --><!-- update timestamp: ${updateDate} -->
  <a><img src="https://img.shields.io/badge/visitors-${visitor}%2f${uniques}-orange?style=plastic"></a>
  <!-- ENDED BADGE -->`;

  if (fs.existsSync('README.md')) {
    const readme = fs.readFileSync('README.md', 'utf-8');
    try {
      if (badgeRegex.test(readme)) {
        const updated = readme.replace(badgeRegex, badgeBlock);
        fs.writeFileSync('README.md', updated);
        console.log(`Updated badge in repo root README.md`);
      } else {
        console.log(`Badge block not found in repo root README.md`);
      }
    } catch (e) {
      console.error('README.md is not found at repo root.');
    }
  }
}

(async () => {
  try {
    const metrics = readJSON(METRICS_JSON);
    const traffic = readJSON(TRAFFIC_JSON);
    metrics.history = mergeHistory(metrics, traffic);
    if (traffic.uniques > 1) {
      metrics.uniques += traffic.uniques;
    }
    metrics.visitor = metrics.history.reduce((sum, it) => sum + it.counter, 0);
    writeJSON(metrics);
    updateReadmeBadge(metrics.visitor, metrics.uniques);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
