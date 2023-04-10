import { userType } from "../lib/isAuth";
import { ApplicantHome } from "./applicant";
import { RecruiterHome } from "./recruiter";

export default function Home() {
  if (userType() === "recruiter") {
    return <RecruiterHome />;
  } else if (userType() === "applicant") {
    return <ApplicantHome />;
  } else {
    return <div>Not logged in</div>;
  }
}