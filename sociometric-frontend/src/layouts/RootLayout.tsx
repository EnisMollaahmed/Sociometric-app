import { Outlet, Link, useNavigate } from 'react-router';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function RootLayout() {
  const { user, token, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !window.location.pathname.includes('/survey/')) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="d-flex flex-column min-vh-100">
      <header>
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Sociometric App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {role === 'teacher' && (
                  <>
                    <Nav.Link as={Link} to="/">My Surveys</Nav.Link>
                    <Nav.Link as={Link} to="/create-survey">Create Survey</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav>
                {token ? (
                  <>
                    <Navbar.Text className="me-3">
                      Welcome, <strong>{user?.name || 'User'}</strong>
                      {role === 'teacher' && (
                        <Badge bg="light" text="dark" className="ms-2">
                          Teacher
                        </Badge>
                      )}
                    </Navbar.Text>
                    <Button variant="outline-light" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main className="flex-grow-1">
        <Container className="mb-5">
          <Outlet />
        </Container>
      </main>

      <footer className="bg-dark text-white py-3">
        <Container>
          <section className="text-center">
            <p className="mb-0">© {new Date().getFullYear()} Sociometric App - School Relationship Analysis</p>
          </section>
        </Container>
      </footer>
    </section>
  );
}