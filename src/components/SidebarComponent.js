import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, Outlet } from "react-router-dom";
import SacredSoundLogo from "../assets/Logo.png";
import LibraryIcon from "../assets/library-icon.png";
import Feed from "../assets/Vector.png";
import Concert from "../assets/Group 189.png";
import MenuBar from "../assets/menubar.svg";
import styled from "styled-components";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const SidebarComponent = () => {
  const [toggled, setToggled] = React.useState(false);
  const location = useLocation();
  const [broken, setBroken] = React.useState(
    window.matchMedia("(max-width: 991px)").matches
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [result, setResult] = useState({tracks: [],
                                        albums: [],
                                        artists: []})
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if(e.target.value.length < 1){
      setIsSearched(false)
    }
  };

  const fetchSearchResult = async (searchQuery) => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getSearchResult/debug9@debug.com/${searchQuery}`;

      const response = await axios.get(url);
      if (response.status === 200) {
        setResult(response.data);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if(searchTerm.length > 0){
        setIsSearched(true)
        await fetchSearchResult(setSearchTerm)
      }else{
        setIsSearched(false)
      }
    }
  };
  return (
    <>
      <Main className="main-wrapper">
        <Sidebar
          className="sidebar"
          toggled={toggled}
          customBreakPoint="991px"
          onBreakPoint={setBroken}
          onBackdropClick={() => setToggled((prev) => !prev)}
        >
          <Logo>
            <img src={SacredSoundLogo} alt="logo"></img>
          </Logo>
          {location.pathname === '/main/library' && <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </SearchContainer>}
          
          <Menu
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: "#13395e",
                  color: "#b6c8d9",
                },
              },
            }}
          >
            <MenuItem component={<Link to="library" />}>
              <img src={LibraryIcon} alt="Upload" /> Library
            </MenuItem>
            <MenuItem component={<Link to="concert" />}>
              <img src={Concert} alt="Upload" /> Concert Hall</MenuItem>
            <MenuItem component={<Link to="#" />}>
              <img src={Feed} alt="Upload" /> Feed</MenuItem>
          </Menu>
        </Sidebar>

        <MenuButton>
          {broken && (
            <div className="menu-button" onClick={() => setToggled(!toggled)}>
              <img src={MenuBar} alt="menubar" />
            </div>
          )}
        </MenuButton>
        <Outlet context={{ isSearched, result }}/>
      </Main>
    </>
  );
};

export default SidebarComponent;

const Main = styled.div`
  display: flex;
  .sidebar {
    .ps-sidebar-container {
      background-color: #fff;
      .ps-menuitem-root{
        a{
          .ps-menu-label{
            gap: 15px;
            display: flex;
            align-items: center;
          }
        }
    }
    }
  }
`;

const Logo = styled.div`
padding: 18px;
img{
  width: 100%;
}
`;

const MenuButton = styled.div`
position: absolute;
z-index: 99;
background-color: transparent !important;
*{
  background-color: transparent !important;
}
img{
  padding: 10px;
  margin: 10px;
  cursor: pointer;
}
`;


const SearchContainer = styled.div`
  display: flex;
  width: 90%;
  margin: auto;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  width: 300px;
`;