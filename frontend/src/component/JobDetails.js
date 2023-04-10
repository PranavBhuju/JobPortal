import { userType } from "../lib/isAuth";
import { RecruiterJobDetails } from "./recruiter";

export default function JobDetails(props) {
    if (userType() === "recruiter") {
        return <RecruiterJobDetails {...props} />;
    } else if (userType() === "applicant") {
        return <RecruiterJobDetails {...props} />;
    } else {
        return <>Not logged in</>;
    }
}