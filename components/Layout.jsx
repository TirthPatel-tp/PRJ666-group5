import { Container } from "react-bootstrap";
import MainNav from "@/components/MainNav";

export default function Layout(props) {
  return (
    <>
      <MainNav />
      <br />
      <Container className="body"> {props.children}</Container>
      <br />
    </>
  );
}
