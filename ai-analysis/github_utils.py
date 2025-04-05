import requests

GITHUB_API = "https://api.github.com"

def get_repositories(username: str, token=None):
    headers = {"Authorization": f"token {token}"} if token else {}
    repos = []
    page = 1

    while True:
        url = f"{GITHUB_API}/users/{username}/repos?per_page=100&page={page}"
        res = requests.get(url, headers=headers, timeout=10)
        data = res.json()

        if not data or res.status_code != 200:
            break

        repos.extend(data)
        page += 1

    return [r for r in repos if not r["fork"]]


def select_top_repositories(repos, max_count=10):
    return sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)[:max_count]


def download_and_combine_code(username: str, repos):
    combined_code = ""
    for repo in repos:
        repo_name = repo["name"]
        zip_url = f"https://github.com/{username}/{repo_name}/archive/refs/heads/{repo['default_branch']}.zip"
        try:
            r = requests.get(zip_url, timeout=15)
            if r.status_code == 200:
                combined_code += f"\n\n# REPO: {repo_name}\n"
                combined_code += f"[Code archive downloaded: {zip_url}]\n"
            else:
                combined_code += f"\n\n# REPO: {repo_name} — Failed to fetch\n"
        except Exception as e:
            combined_code += f"\n\n# REPO: {repo_name} — Error: {str(e)}\n"
    return combined_code
