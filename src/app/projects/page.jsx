import Link from "next/link";
const Projects = () => {
  return (
    <div className="link">
      <Link href="/">Home</Link>
      <Link href="/projects/italian-qualification">Qualification</Link>
      <Link href="/projects/italian-documents">Documents</Link>
    </div>
  );
};

export default Projects;
