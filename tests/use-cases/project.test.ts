import { createProjectId } from "@/domain/shared/types";
import { FakeProjectRepository } from "../infrastructure/repositories/FakeProjectRepository";
import { Project } from "@/domain/project/Project";
import { createProject, deleteProject, getProject, listProjects, renameProject } from "@/use-cases/project";

const PROJECT_ID = createProjectId();

describe("Project use cases", () => {
  let fakeRepository: FakeProjectRepository;

  beforeEach(() => {
    fakeRepository = new FakeProjectRepository();
  });

  describe("createProject", () => {
    it("should create a Project in the db", async () => {
      const project = await createProject(fakeRepository, "New Project");
      const newProject = await fakeRepository.findById(project.id);

      expect(newProject).not.toBeNull();
      expect(newProject?.name).toBe("New Project");
      expect(newProject?.id).toBeDefined();
      expect(newProject?.createdAt).toBeInstanceOf(Date);
    });

    it("should throw when name is invalid", async () => {
      await expect(
        createProject(fakeRepository, "")
      ).rejects.toThrow("Project name cannot be empty")
    });
  });
  
  describe("renameProject", () => {
    it("should successfully rename an existing project", async () => {
      // arrange: puts an existing project in the fake repo
      const initialProject = Project.restore(PROJECT_ID, "Old Name", new Date(), new Date());
      fakeRepository.items.push(initialProject);

      // act: executes the use case
      await renameProject(fakeRepository, PROJECT_ID, "New name");

      // assert: validates if the fake repository was updated
      const updatedProject = await fakeRepository.findById(PROJECT_ID);
      expect(updatedProject?.name).toBe("New name");
    });

    it("should throw an error if the project does not exist", async () => {
      // arrange: empty

      // act & assert: makes sure that the use throws the error
      await expect(
        renameProject(fakeRepository, PROJECT_ID, "I don't exist")
      ).rejects.toThrow("Project not found");
    });

    it("should throw an error if the name is empty", async () => {
      const initialProject = Project.restore(PROJECT_ID, "Old Name", new Date(), new Date());
      fakeRepository.items.push(initialProject);
      
      await expect(
        renameProject(fakeRepository, PROJECT_ID, "")
      ).rejects.toThrow("Project name cannot be empty");
    });

    it("should throw an error if the name is only spaces", async () => {
      const initialProject = Project.restore(PROJECT_ID, "Old Name", new Date(), new Date());
      fakeRepository.items.push(initialProject);

      await expect(
        renameProject(fakeRepository, PROJECT_ID, "     ")
      ).rejects.toThrow("Project name cannot be empty");
    });
  });

  describe("listProjects", () => {
    it("should return a list of Projects when db is populated", async () => {
      const project1 = Project.restore(createProjectId(), "Project 1", new Date(), new Date());
      const project2 = Project.restore(createProjectId(), "Project 2", new Date(), new Date());
      const project3 = Project.restore(createProjectId(), "Project 3", new Date(), new Date());

      fakeRepository.items.push(project1, project2, project3);

      const projects = await listProjects(fakeRepository);

      expect(projects.length).toBe(3);
    });

    it("should return an empty array when db is not populated", async () => {
      const projects = await listProjects(fakeRepository);

      expect(projects.length).toBe(0);
    });
  });

  describe("getProject", () => {
    it("should return a Project", async () => {
      const project = Project.restore(PROJECT_ID, "I exist", new Date(), new Date());
      fakeRepository.items.push(project);

      const retrievedProject = await getProject(fakeRepository, project.id);

      expect(retrievedProject).not.toBeNull();
      expect(retrievedProject?.name).toBe("I exist");
      expect(retrievedProject?.createdAt).toBeInstanceOf(Date);
    });

    it("should return null when not found", async () => {});
    // TBI
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const project = Project.restore(PROJECT_ID, "Delete me", new Date(), new Date());
      fakeRepository.items.push(project);

      await deleteProject(fakeRepository, project.id);

      expect(fakeRepository.items.length).toBe(0);
    });

    // delete and forget. No need to test if id doesn't match any record
  });
});

/**
 * rename:
 *  class 1: valid name
 *  class 2: project doesn't exist (throw)
 *  class 3: invalid name (throw)
 * 
 * listProjects:
 *  class 1: valid (db populated)
 *  class 2: valid (empty db, return [])
 * 
 * getProject:
 *  class 1: valid (id exists)
 *  class 2: valid, not found // maybe change this to throw in the 
 * 
 * deleteProject:
 *  class 1: valid (removes project and its counters)
 * 
 * createProject:
 *  class 1: valid (creates)
 *  class 2: invalid (empty name, throws)
 */