# 每周合并仓库的 traffic/views 数据

1. 账户 Settings > Developer Settings > Personal Access Tokens > Fine-grained Tokens 创建访问密钥
1. 访问密钥设置 Repository access 权限选择 All repositories
1. 访问密钥设置 Permissions 权限需要 Administration, Metadata

1. 查看文件 [/traffic.js] 和 [/.github/workflows/update-activity.yml]
1. 仓库 Settings > Secrets and Variables > Actions > secrets > Repository secrets > TRAFFIC_TOKEN
1. 仓库级环境变量 TRAFFIC_TOKEN 的值即上述生成的 Fine-grained Tokens 密钥(需 Administration 权限)

1. <https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps>
1. 页面搜索 `/repos/OWNER/REPO/traffic/views` 关于 Repository permissions for "Administration"

```bash
# https://docs.github.com/en/rest/metrics/traffic
curl \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -L https://api.github.com/repos/charlie-wong/charlie-wong/traffic/views

gh api "/repos/charlie-wong/charlie-wong/traffic/views" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10"
```
