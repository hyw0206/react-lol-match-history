import "../styles/header.css"

const Header = () => {
  return (
    <header className="header" id="top">
      <a rel="noopener noreferrer" target="_blank" href="https://www.leagueoflegends.com/ko-kr/"><div className="nav-item">Game Homepage</div></a>
      <a rel="noopener noreferrer" target="_blank" href="https://github.com/hyw0206/react-lol-match-history"><div className="nav-item">Source Code</div></a>
      <div className="nav-item">|</div>
      <a href="#match"><div className="nav-item">게임 전적</div></a>
      <a href="#mastery"><div className="nav-item">숙련도 정보</div></a>
    </header>
  )
}

export default Header;