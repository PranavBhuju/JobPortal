import { userType } from '../lib/isAuth';
import { ApplicantProfile } from './applicant';
import { RecruiterProfile } from './recruiter';

export default function Profile() {
    if (userType() === "recruiter") {
        return <RecruiterProfile />;
    } else if (userType() === "applicant") {
        return <ApplicantProfile />;
    } else {
        return <div>Not logged in</div>;
    }
}