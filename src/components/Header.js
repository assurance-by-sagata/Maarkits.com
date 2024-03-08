import React, { useEffect } from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from '../context/ThemeContext';
import { useHistory } from 'react-router-dom';
import { userState,isLoggedInState } from '../state'
import { clearUserDataAndLogout } from '../auth';
import { useSetRecoilState,useRecoilValue } from 'recoil';

const Header = () => {
    const userData = useRecoilValue(userState);
    const history = useHistory(); // Initialize useHistory
    const setUserState = useSetRecoilState(userState); // Recoil hook to set user information
    const setLoggedInState = useSetRecoilState(isLoggedInState); // Recoil hook to set user isLoggedInState
    useEffect(() => {
      let el = document.querySelector('#darkTheme');
      if (el) {
        el.addEventListener('click', function () {
          document.body.classList.toggle('dark');
        });
      }
    }, []);

    const handleLogout = () => {
      clearUserDataAndLogout(setUserState,setLoggedInState);
      // Redirect to the login page after logout
      history.push('/'); // Change the path to your login page
    };
    return (
      <>
        <header className="light-bb">
          <Navbar expand="lg">
            <Link className="navbar-brand" to="/">
              <ThemeConsumer>
                {({ data }) => {
                  return data.theme === 'light' ? (
                    // <img src={'img/logo-dark.svg'} alt="logo" />
                     <h1>MarketsDojo</h1>
                  ) : (
                    //<img src={'img/logo-light.svg'} alt="logo" />
                    <h1>MarketsDojo</h1>
                  );
                }}
              </ThemeConsumer>
            </Link>

            <Navbar.Collapse id="basic-navbar-nav">

              <Nav className="navbar-nav ml-auto">
                <Dropdown className="header-custom-icon">
                  <ThemeConsumer>
                    {({ data, update }) => (
                      <Button variant="default" onClick={update} id="darkTheme">
                        {data.theme === 'light' ? (
                          <i className="icon ion-md-moon"></i>
                        ) : (
                          <i className="icon ion-md-sunny"></i>
                        )}
                      </Button>
                    )}
                  </ThemeConsumer>
                </Dropdown>
                <Dropdown className="header-img-icon">
                  <Dropdown.Toggle variant="default">
                    <img src={'img/avatar.svg'} alt="avatar" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className="dropdown-header d-flex flex-column align-items-center">
                      <div className="figure mb-3">
                        <img src={'img/avatar.svg'} alt="" />
                      </div>
                      <div className="info text-center">
                        <p className="name font-weight-bold mb-0">{userData?.username}</p>
                        <p className="email text-muted mb-3">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                    <div className="dropdown-body">
                      <ul className="profile-nav">
                        <li className="nav-item">
                          <Link  className="nav-link red" onClick={handleLogout}>
                            <i className="icon ion-md-power"></i>
                            <span>Log Out</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
      </>
    );
};
export default Header;
