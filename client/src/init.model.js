import { types, flow } from "mobx-state-tree"

const Init = types
  .model({
    appReady: false,
  })
  .actions(self => {
    
  });

// someModel.actions(self => {
//     const fetchProjects = flow(function* () {
//         self.state = "pending"
//         try {
//             // ... yield can be used in async/await style
//             self.githubProjects = yield fetchGithubProjectsSomehow()
//             self.state = "done"
//         } catch (e) {
//             // ... including try/catch error handling
//             console.error("Failed to fetch projects", error)
//             self.state = "error"
//         }
//         // The action will return a promise that resolves to the returned value
//         // (or rejects with anything thrown from the action)
//         return self.githubProjects.length
//     })

//     return { fetchProjects }
// })