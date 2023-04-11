import { userType } from "../lib/isAuth";
import { ApplicantJobDetails } from "./applicant";
import { RecruiterJobDetails } from "./recruiter";

export default function JobDetails(props) {
    if (userType() === "recruiter") {
        return <RecruiterJobDetails {...props} />;
    } else if (userType() === "applicant") {
        return <ApplicantJobDetails {...props} />;
    } else {
        return <>Not logged in</>;
    }
}