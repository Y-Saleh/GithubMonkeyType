export const implementationKey = "git-monkey-v1";

export const practiceCommands = [
  { cmd: "git init", desc: "Initialize a new Git repository" },
  { cmd: "git clone <url>", desc: "Clone a repository into a new directory" },
  { cmd: "git add .", desc: "Add all changes to the staging area" },
  { cmd: "git commit -m \"message\"", desc: "Record changes to the repository" },
  { cmd: "git push origin main", desc: "Upload local branch commits to remote" },
  { cmd: "git pull", desc: "Fetch from and integrate with another repo" },
  { cmd: "git checkout -b branch-name", desc: "Create and switch to a new branch" },
  { cmd: "git merge branch-name", desc: "Join two or more development histories" },
  { cmd: "git status", desc: "Show the working tree status" },
  { cmd: "git log", desc: "Show commit logs" },
  { cmd: "git stash", desc: "Stash the changes in a dirty working directory" },
  { cmd: "git stash pop", desc: "Apply the changes recorded in the stash" },
  { cmd: "git branch", desc: "List, create, or delete branches" },
  { cmd: "git remote -v", desc: "Show associated remote repositories" },
  { cmd: "git fetch", desc: "Download objects and refs from another repo" },
  { cmd: "git reset --hard", desc: "Reset current HEAD to the specified state" },
  { cmd: "git revert HEAD", desc: "Revert some existing commits" },
  { cmd: "git diff", desc: "Show changes between commits, commit and working tree" },
  { cmd: "git show", desc: "Show various types of objects" },
  { cmd: "git tag v1.0.0", desc: "Create, list, delete or verify a tag object" },
  { cmd: "git rebase main", desc: "Reapply commits on top of another base tip" },
  { cmd: "git cherry-pick <commit-hash>", desc: "Apply the changes introduced by some existing commits" },
  { cmd: "git config --global user.name", desc: "Set global username for Git" },
  { cmd: "git config --global user.email", desc: "Set global email for Git" },
  { cmd: "git rm cached file.txt", desc: "Remove files from the index" },
  { cmd: "git clean -fd", desc: "Remove untracked files from the working tree" },
  { cmd: "git bisect start", desc: "Use binary search to find the commit that introduced a bug" },
  { cmd: "git blame file.txt", desc: "Show what revision and author last modified each line of a file" },
  { cmd: "git reflog", desc: "Manage reflog information" },
  { cmd: "git shortlog -sn", desc: "Summarize 'git log' output" }
];

export const quizQuestions = [
  {
    question: "Initialize a new Git repository",
    answer: "git init"
  },
  {
    question: "Stage all changes in the current directory",
    answer: "git add ."
  },
  {
    question: "Commit staged changes with a message",
    answer: "git commit -m \"message\""
  },
  {
    question: "Push changes to the remote main branch",
    answer: "git push origin main"
  },
  {
    question: "Create and switch to a new branch",
    answer: "git checkout -b new-branch"
  },
  {
    question: "Check the status of the repository",
    answer: "git status"
  },
  {
    question: "List current branches",
    answer: "git branch"
  },
  {
    question: "Discard all local changes in working directory",
    answer: "git checkout -- ."
  },
  {
    question: "Fetch latest changes from remote without merging",
    answer: "git fetch"
  },
  {
    question: "Show commit logs",
    answer: "git log"
  },
  {
    question: "Stash current changes",
    answer: "git stash"
  },
  {
    question: "Apply the latest stashed changes",
    answer: "git stash pop"
  }
];
