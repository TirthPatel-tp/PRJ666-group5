import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import Head from "next/head";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <MDBContainer fluid className="main-content" style={{ height: "50vh" }}>
      <Head>
        <title>Profile</title>
      </Head>
      {user ? (
        <>
          <h1 className="page-header"></h1>
          <MDBRow className="align-items-center">
            <MDBCol md="6" className="d-flex">
              <MDBCard className="main-card profile-card">
                <MDBCardBody>
                  <Image
                    src="/images/User-Profile-PNG-Image.png"
                    alt="Profile Image"
                    width={200}
                    height={200}
                    style={{ borderRadius: "50%", margin: "3rem" }}
                  />
                  <h4 style={{ textAlign: "left" }}>Profile:</h4>
                  <table className="user-info-table">
                    <tbody>
                      <tr>
                        <td>Name:</td>
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <td>School ID:</td>
                        <td>{user.school_id}</td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td>{user.email}</td>
                      </tr>
                      <tr>
                        <td>Role:</td>
                        <td>{user.title}</td>
                      </tr>
                    </tbody>
                  </table>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="6" className="d-flex flex-wrap justify-content-center">
              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("/courses")}
              >
                <MDBCardBody>
                  <h3>Courses</h3>
                </MDBCardBody>
              </MDBCard>
              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("/calendar")}
              >
                <MDBCardBody>
                  <h3>Calendar</h3>
                </MDBCardBody>
              </MDBCard>
              {user.title === "student" && (
                <MDBCard
                  className="main-card tile-card"
                  onClick={() => router.push("/timetable")}
                >
                  <MDBCardBody>
                    <h3>Timetable</h3>
                  </MDBCardBody>
                </MDBCard>
              )}

              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("/grade")}
              >
                <MDBCardBody>
                  <h3>Grades</h3>
                </MDBCardBody>
              </MDBCard>
              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("#")}
              >
                <MDBCardBody>
                  <h3>Messages</h3>
                </MDBCardBody>
              </MDBCard>
              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("#")}
              >
                <MDBCardBody>
                  <h3>Tools</h3>
                </MDBCardBody>
              </MDBCard>

              {user.title === "student" && (
                <MDBCard
                  className="main-card tile-card"
                  onClick={() => router.push("/receipts")}
                >
                  <MDBCardBody>
                    <h3>Receipts</h3>
                  </MDBCardBody>
                </MDBCard>
              )}
              
              <MDBCard
                className="main-card tile-card"
                onClick={() => router.push("/signin")}
              >
                <MDBCardBody>
                  <h3>Sign Out</h3>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </>
      ) : (
        <MDBRow className="justify-content-center">
          <MDBCol>
            <MDBCard className="main-card profile-card mt-5">
              <MDBCardBody className="text-center">
                <Image
                  src="/images/sauce_bottle.png"
                  alt="Sauce Bottle"
                  width={150}
                  height={150}
                />
                <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                  Sauce
                </h1>
                <p>No user is logged in. Please log in to view your profile.</p>
                <MDBBtn
                  className="custom-button"
                  onClick={() => router.push("/signin")}
                >
                  Go to Sign In
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}
