import { Project } from "@/domain/project/Project";
import { createProjectId, ProjectId } from "@/domain/shared/types";

// const PROJECT_ID = createProjectId();
const PROJECT_ID = "project-1" as ProjectId;

function createProject(name = "Sweater") {
  return Project.create(PROJECT_ID, name);
}

describe.only("Project Domain Entity", () => {
  it("creates a project", () => {
    const project = createProject();

    expect(project.getName()).toBe("Sweater");
  });

  it("trims the project name", () => {
    const project = createProject("  Sweater  ");
    expect(project.getName()).toBe("Sweater");
  });

  it("sets createdAt and updatedAt", () => {
    const project = createProject();

    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.getUpdatedAt()).toBeInstanceOf(Date);

    expect(project.createdAt.getTime())
      .toBe(project.getUpdatedAt().getTime());
  });

  it("throws when name is empty", () => {
    expect(() => 
      createProject("")).toThrow("Project name cannot be empty");
  });

  it("restores a project", () => {
    const createdAt = new Date("2026-01-01");
    const updatedAt = new Date("2026-01-02");

    const project = Project.restore(
      PROJECT_ID,
      "Sweater",
      createdAt,
      updatedAt
    );

    expect(project.createdAt).toBe(createdAt);
    expect(project.getUpdatedAt()).toBe(updatedAt);
    expect(project.getName()).toBe("Sweater");
  });

  it("renames a project", () => {
    const project = createProject();

    project.rename("Scarf");

    expect(project.getName()).toBe("Scarf");
  });

  it("trims the new name", () => {
    const project = createProject();

    project.rename("  Scarf  ");

    expect(project.getName()).toBe("Scarf");
  });

  it("updates updatedAt when renamed", async () => {
    const project = createProject();
    const oldDate = project.getUpdatedAt();

    await new Promise(resolve => setTimeout(resolve, 5));

    project.rename("Scarf");

    expect(project.getUpdatedAt().getTime())
      .toBeGreaterThan(oldDate.getTime());
  });

  it("throws when renaming to an empty name", () => {
    const project = createProject();

    expect(() =>
      project.rename("")
    ).toThrow("Project name cannot be empty");
  });
});