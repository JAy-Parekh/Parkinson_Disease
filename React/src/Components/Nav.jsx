import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar expand="md" bg="dark" variant="dark" expanded={expanded}>
      <Container>
        <Navbar.Brand href="#home">Parkinson's Disease</Navbar.Brand>
        <Navbar.Toggle onClick={handleToggle} />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
