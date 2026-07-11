import { Project } from "@/domain/project/Project"

describe("Project Domain Entity", () => {
  const createTestProject = (name: string = "Test Project") => {
    return new Project(
      "project-1",
      name,
      new Date(),
      new Date()
    );
  };

  describe("rename", () => {
    it("should rename the project", () => {
      const project = createTestProject();
      project.rename("New Project Name");
      expect(project.getName()).toBe("New Project Name");
    });
  });
});