import { Project } from "@/domain/project/Project";
import { ProjectId } from "@/domain/shared/types";

// const PROJECT_ID = createProjectId();
const PROJECT_ID = "project-1" as ProjectId;

function createProject(name = "Sweater") {
  return Project.create(PROJECT_ID, name);
}

describe("Project Domain Entity", () => {
  it("creates a project", () => {
    const project = createProject();

    expect(project.name).toBe("Sweater");
  });

  it("trims the project name", () => {
    const project = createProject("  Sweater  ");
    expect(project.name).toBe("Sweater");
  });

  it("sets createdAt and updatedAt", () => {
    const project = createProject();

    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);

    expect(project.createdAt.getTime())
      .toBe(project.updatedAt.getTime());
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
    expect(project.updatedAt).toBe(updatedAt);
    expect(project.name).toBe("Sweater");
  });

  it("renames a project", () => {
    const project = createProject();

    project.rename("Scarf");

    expect(project.name).toBe("Scarf");
  });

  it("trims the new name", () => {
    const project = createProject();

    project.rename("  Scarf  ");

    expect(project.name).toBe("Scarf");
  });

  it("updates updatedAt when renamed", () => {
    jest.useFakeTimers();
    
    const project = createProject();
    const oldDate = project.updatedAt;

    jest.advanceTimersByTime(1000);
    project.rename("Scarf");

    expect(project.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());

    jest.useRealTimers();
  });

  it("throws when renaming to an empty name", () => {
    const project = createProject();

    expect(() =>
      project.rename("")
    ).toThrow("Project name cannot be empty");
  });
});