// components/MainNav.jsx
import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function MainNav() {
  const router = useRouter();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);

  const handleSelect = () => {
    setExpanded(false); // Collapse the navbar
  };

  return (
    <>
      <Navbar
        expand="sm"
        className="fixed-top navbar-dark navbar-custom"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand
            className="navbar-brand-custom"
            onClick={() => {
              router.push("/");
              handleSelect();
            }}
          >
            <Image
              src="/images/sauce_bottle.png"
              alt="Sauce Bottle"
              width={30}
              height={30}
            />
            SAUCE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Profile</Nav.Link>
              </Link>
              <Link href="/courses" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Courses</Nav.Link>
              </Link>
              <Link href="/calendar" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Calendar</Nav.Link>
              </Link>
              <Link href="/help" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Help</Nav.Link>
              </Link>
              <Link href="/signin" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>
                  {user ? "Signout" : "Signin"}
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
