## FAQ

**Q:** What is this site?

**A:** A playground for trying out new / recent AI coding agents and tools while building small sample sites.

**Q:** What AI tools were used?

**A:** Site initially created with Jules (Google). When that approach came up short, switched to Copilot in Agent Mode w/GPT 5 model (Github / MS in VS Code)  

**Q:** What other some other AI Agent coding tools are out there to try?

**A:** There are tons with new ones being released every month.  Here are a few: Claude Agent, Windsurf, Cursor, Cline, CrewAI. 

## Deployment:

[Visualizers](https://billharrisdev.github.io/visualizers) 

## Evaluations

**Jules** - Capabilities are a bit underwhelming for vibe coding a Nextjs / Tailwind site with ShadCN components.  
It might be better given less restrictions, but after about a dozen interactions it was unable to figure out tailwind v4 initialization. 
Other issues -  No live preview functionality.  It tried writing some python with Playright to verify correctness of new work. It would attempt to browse / find elements,
but it failed repeatedly and just added 10 minutes to each step.  Eventually it would ask me to do the QA, which was impossible, because it didn't commit yet.
It kept reverting to this approach even after I tried making a rules.MD and set up Jest unit tests.

**Pros:** It did a good job of implementing sort and search algorithms apart from the details of the UX. I expect it to do well with functions and hopefully not 
hallucinate in part due to exceptionally long context.




