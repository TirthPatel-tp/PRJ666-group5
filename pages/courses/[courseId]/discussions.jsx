import { useRouter } from "next/router";
import Head from "next/head";
import CourseLayout from "../../../components/common/CourseLayout";
import { useUser } from "../../../context/UserContext";
import NewPostForm from "../../../components/Discussion/NewPostForm";
import DiscussionList from "../../../components/Discussion/DiscussionList";

export default function DiscussionsPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useUser();

  if (!user) return <p>Loading user info...</p>;

  return (
    <CourseLayout courseId={courseId}>
      <Head>
        <title>Discussions</title>
      </Head>
      <h2 className="material-header">Discussions</h2>

      {user.title === "professor" && <NewPostForm courseId={courseId} />}

      <DiscussionList courseId={courseId} user={user} />

      <button className="btn btn-secondary mt-3" onClick={() => router.back()}>
        Back
      </button>
    </CourseLayout>
  );
}
