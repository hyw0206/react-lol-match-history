import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { findChampion } from '../Modules/FunctionModule';
import "../styles/app.css"
function App() {
  // useState로 state 세팅
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [mastery, setMastery] = useState(null);
  const [matchInfo, setMatchInfo] = useState([]);
  // 변수 세팅
  const api_key = "";
  const inputEl = useRef(null);
  const fetch = async (nickname = "hide on bush") => {
    try {
      // 데이터 초기화
      setUser(null);
      setUsers(null);
      setMastery(null);
      setMatchInfo([]);
      setLoading(true);
      // 기본 데이터 받아오기
      const response = await axios.get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${api_key}`
      )
      setUsers(response.data)
      const summonerId = response.data.id;
      // summoner의 rank 데이터 받아오기
      const userResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`
      )
      setUser(userResponse.data)
      // summoner의 mastery data 받아오기
      const masteryResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/top?count=10&&api_key=${api_key}`
      )
      setMastery(masteryResponse.data)
      const puuid = response.data.puuid;
      // 최근 전적 받아오기
      const matchResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${api_key}`
      )
      const matchResultResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchResponse.data[0]}?api_key=${api_key}`
      )
      const matchResultResponse2 = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchResponse.data[1]}?api_key=${api_key}`
      )
      const matchResultResponse3 = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchResponse.data[2]}?api_key=${api_key}`
      )
      const matchResultResponse4 = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchResponse.data[3]}?api_key=${api_key}`
      )
      // 받아온 최근 전적 배열 push
      setMatchInfo(matchInfo => [...matchInfo, matchResultResponse.data.info])
      setMatchInfo(matchInfo => [...matchInfo, matchResultResponse2.data.info])
      setMatchInfo(matchInfo => [...matchInfo, matchResultResponse3.data.info])
      setMatchInfo(matchInfo => [...matchInfo, matchResultResponse4.data.info])
    } catch (e) {
      alert("소환사 이름을 제대로 입력해주세요! \n만약 2글자 닉네임이라면, 띄어쓰기도 포함해주세요. \n정상적인 이용을 위해 새로고침을 진행합니다.");
      setLoading(false);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
    setLoading(false)
  }
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);
  const sendNickName = () => {
    if (inputEl.current.value === '') alert("소환사 이름을 제대로 입력해주세요!");
    else fetch(inputEl.current.value);
  }
  if (loading) return <div className="loading">로딩중..</div>;
  if (!users) return null;
  const loadMatch = (cnt) => {
    console.log(matchInfo[cnt])
    for (let i = 0; i < matchInfo[cnt].participants.length; i++) {
      if (users.name === matchInfo[cnt].participants[i].summonerName) {
        return (
          <div className="match-wrap">
            <div className="match-item">
              <div className="match-info">
                {matchInfo[cnt].queueId === 430 || matchInfo[cnt].queueId === 400 ?
                  <div>일반 게임</div> :
                  matchInfo[cnt].queueId === 420 ?
                    <div>개인/2인 랭크 게임</div> :
                    matchInfo[cnt].queueId === 440 ?
                      <div>자유 랭크 게임</div> :
                      matchInfo[cnt].queueId === 450 ?
                        <div>칼바람 나락</div> :
                        matchInfo[cnt].queueId === 700 || matchInfo[cnt].queueId === 720 ?
                          <div>격전</div> :
                          matchInfo[cnt].queueId === 900 ?
                            <div>우르프</div> :
                            matchInfo[cnt].queueId === 920 ?
                              <div>포로 왕</div> :
                              matchInfo[cnt].queueId === 1020 ?
                                <div>단일 챔피언</div> :
                                matchInfo[cnt].queueId === 1300 ?
                                  <div>돌격 넥서스</div> :
                                  matchInfo[cnt].queueId === 1400 ?
                                    <div>궁극기 주문서</div> :
                                    matchInfo[cnt].queueId === 2000 || matchInfo[cnt].queueId === 2010 || matchInfo[cnt].queueId === 2020 ?
                                      <div>튜토리얼</div> :
                                      <div>AI 대전</div>
                }
                {matchInfo[cnt].participants[i].win ? <div className="wl win">WIN</div> : <div className="wl lose">LOSE</div>}
                <div>{(matchInfo[cnt].participants[i].timePlayed / 60).toFixed(1)} 분</div>
                {matchInfo[cnt].participants[i].teamId === 100 ? <div><strong>{matchInfo[cnt].teams[0].objectives.champion.kills}</strong> vs {matchInfo[cnt].teams[1].objectives.champion.kills}</div> : <div><strong>{matchInfo[cnt].teams[1].objectives.champion.kills}</strong> vs {matchInfo[cnt].teams[0].objectives.champion.kills}</div>}
                <div>
                  {
                    (() => {
                      let timestamp = matchInfo[cnt].gameEndTimestamp;
                      let day = new Date(timestamp);
                      let nowDay = new Date();
                      let diffDay = day.getTime() - nowDay.getTime();
                      diffDay = Math.abs(diffDay / (1000 * 60 * 60 * 24));
                      let hour = ((diffDay % 1) * 10 * 2.4);
                      if (cnt >= 3 && hour.toFixed(0) < 20) diffDay += 1;
                      // eslint-disable-next-line
                      return diffDay.toFixed(0) == 0 ? (hour.toFixed(0) == 0 ? "1시간 미만" : hour.toFixed(0) + "시간") : diffDay.toFixed(0) + "일 " + hour.toFixed(0) + "시간"
                    })()
                  } 전
                </div>
              </div>
              <div className="match-basic longtext">
                <div>챔피언 - {matchInfo[cnt].participants[i].championName} | 레벨 - {matchInfo[cnt].participants[i].champLevel} | 라인 - {matchInfo[cnt].queueId !== 450 ? matchInfo[cnt].participants[i].teamPosition : "X"}</div>
                <div>KDA - {matchInfo[cnt].participants[i].kills}/{matchInfo[cnt].participants[i].deaths}/{matchInfo[cnt].participants[i].assists}</div>
                {matchInfo[cnt].queueId >= 800 ? <div className="longtext">평점을 지원하지 않는 게임 모드입니다.</div> : <div>평점 - {matchInfo[cnt].participants[i].deaths === 0 ? "PERFECT" : ((matchInfo[cnt].participants[i].kills + matchInfo[cnt].participants[i].assists) / matchInfo[cnt].participants[i].deaths).toFixed(2)}</div>}
              </div>
              <div className="match-plus">
                {
                  matchInfo[cnt].gameEndTimestamp === undefined || matchInfo[cnt].gameEndTimestamp <= 1648738800000 ? <div className="longtext">너무 오래 된 게임의 세부사항은 <br /> 지원하지 않습니다.</div> :
                  matchInfo[cnt].queueId >= 800 ? <div className="longtext">세부 정보를 지원하지 않는 모드입니다.</div> :
                    <>
                      {matchInfo[cnt].queueId >= 800 ? <div className="longtext">킬 관여율을 지원하지 않는 게임 모드입니다.</div> : <div>킬 관여 {(matchInfo[cnt].participants[i].challenges.killParticipation * 100).toFixed(1)}%</div>}
                      <div>CS {matchInfo[cnt].participants[i].neutralMinionsKilled + matchInfo[cnt].participants[i].totalMinionsKilled} ({((matchInfo[cnt].participants[i].neutralMinionsKilled + matchInfo[cnt].participants[i].totalMinionsKilled) / (matchInfo[cnt].participants[i].timePlayed / 60)).toFixed(1)})</div>
                      {matchInfo[cnt].queueId >= 800 ? <div className="longtext">데미지 관련 데이터를 지원하지 않는 게임 모드입니다.</div> : matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1) >= 500 ? matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1) >= 800 ? matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1) >= 1000 ? <div className="verygood">데미지 (DPM) - {matchInfo[cnt].participants[i].totalDamageDealtToChampions} ({matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1)})</div> : <div className="good">데미지 (DPM) - {matchInfo[cnt].participants[i].totalDamageDealtToChampions} ({matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1)})</div> : <div className="nb">데미지 (DPM) - {matchInfo[cnt].participants[i].totalDamageDealtToChampions} ({matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1)})</div> : <div className="bad">데미지 (DPM) - {matchInfo[cnt].participants[i].totalDamageDealtToChampions} ({matchInfo[cnt].participants[i].challenges.damagePerMinute.toFixed(1)})</div>}
                      {matchInfo[cnt].queueId >= 800 ? <div className="longtext">데미지 관련 데이터를 지원하지 않는 게임 모드입니다.</div> : <div>팀 데미지 관여율 {(matchInfo[cnt].participants[i].challenges.teamDamagePercentage * 100).toFixed(1)}% </div>}
                    </>
                }
              </div>
            </div>
          </div>
        )
      }
    }
  }
  return (
    <div className="App">
      <a href="#top"><div className="sidebar">Go Top</div></a>
      <div className="send-nickname">
        <input minLength={2} placeholder='소환사의 이름을 입력해주세요. (2글자 닉네임은 띄어쓰기 포함)' ref={inputEl}></input>
        <button onClick={sendNickName}>전송</button>
      </div>
      <div className="wrapper">
        <div className="summoner-info">
          <div>소환사의 이름 : {users.name} </div>
          <div>소환사의 레벨 : {users.summonerLevel}</div>
        </div>
      </div>

      <div className="lol-rank">
        <div className="lol">
          {user.length === 0 ?
            <div className="summoner-rank">
              <h2>랭크 게임 전적이 없습니다.</h2>
            </div>
            :
            <div className="summoner-rank">

              {user[0].queueType === "RANKED_SOLO_5x5" ?
                <div className="summoner-rank-info">
                  <h2>솔로 랭크 게임 전적</h2>
                  <div className="tier">소환사의 티어 : {user[0].tier}{" "}{user[0].rank}</div>
                  <div className="lp">소환사의 점수 : {user[0].leaguePoints} LP</div>
                  <div className="record">소환사의 전적 : {user[0].wins}승 {user[0].losses}패</div>
                  <div className="wr">승률 : {((user[0].wins) / (user[0].wins + user[0].losses) * 100).toFixed(1)}%</div>
                </div>
                :
                (user.length === 1 && user[0].queueType === "RANKED_FLEX_SR") ?
                  <div className="summoner-rank-info">
                    <h2>자유 랭크 게임 전적</h2>
                    <div className="tier">소환사의 티어 : {user[0].tier}{" "}{user[0].rank}</div>
                    <div className="lp">소환사의 점수 : {user[0].leaguePoints} LP</div>
                    <div className="record">소환사의 전적 : {user[0].wins}승 {user[0].losses}패</div>
                    <div className="wr">승률 : {((user[0].wins) / (user[0].wins + user[0].losses) * 100).toFixed(1)}%</div>
                  </div> :
                  user[0].queueType === "RANKED_TFT_DOUBLE_UP" ? "" :
                    <div className="summoner-rank-info">
                      <h2>솔로 랭크 게임 전적</h2>
                      <div className="tier">소환사의 티어 : {user[1].tier}{" "}{user[1].rank}</div>
                      <div className="lp">소환사의 점수 : {user[1].leaguePoints} LP</div>
                      <div className="record">소환사의 전적 : {user[1].wins}승 {user[1].losses}패</div>
                      <div className="wr">승률 : {((user[1].wins) / (user[1].wins + user[1].losses) * 100).toFixed(1)}%</div>
                    </div>
              }
            </div>
          }
          {(user.length === 1 && (user[0].queueType === "RANKED_TFT_DOUBLE_UP")) || (user.length === 1 && (user[0].queueType === "RANKED_FLEX_SR")) ?
            <div className="summoner-rank">
              <h2>랭크 게임 전적이 없습니다.</h2>
            </div> :
            (user.length === 1) &&
            <div className="summoner-rank-flex">
              <h2>자유 랭크 게임 전적이 없습니다.</h2>
            </div>
          }
          {user.length === 2 &&
            <div className="summoner-rank-flex">
              {user[1].queueType === "RANKED_FLEX_SR" ?
                <div className="summoner-rank-flex-info">
                  <h2>자유 랭크 게임 전적</h2>
                  <div className="tier">소환사의 티어 : {user[1].tier}{" "}{user[1].rank}</div>
                  <div className="lp">소환사의 점수 : {user[1].leaguePoints} LP</div>
                  <div className="record">소환사의 전적 : {user[1].wins}승 {user[1].losses}패</div>
                  <div className="wr">승률 : {((user[1].wins) / (user[1].wins + user[1].losses) * 100).toFixed(1)}%</div>
                </div>
                :
                <div className="summoner-rank-flex-info">
                  <h2>자유 랭크 게임 전적</h2>
                  <div className="tier">소환사의 티어 : {user[0].tier}{" "}{user[0].rank}</div>
                  <div className="lp">소환사의 점수 : {user[0].leaguePoints} LP</div>
                  <div className="record">소환사의 전적 : {user[0].wins}승 {user[0].losses}패</div>
                  <div className="wr" >승률 : {((user[0].wins) / (user[0].wins + user[0].losses) * 100).toFixed(1)}%</div>
                </div>
              }
            </div>
          }
        </div>
        
      </div>
      <h2 className="title" id="match">최근 게임 전적</h2>
      <div className="match-wrap">
        <div className="match-list">
          {loadMatch(0)}
          {loadMatch(2)}
        </div>
        <div className="match-list">
          {loadMatch(1)}
          {loadMatch(3)}
        </div>
      </div>
      <h2 className="title" id="mastery">숙련도 정보</h2>
      <div className="mastery-wrap">
        <div className="summoner-mastery">
          {mastery.length === 10 ?
            mastery.map(function (data, index){
              return index < 5 ? (
                <div key={index + 10000} className="summoner-mastery-info">
                  <div key={index + 1000}>모스트 {index + 1}</div>
                  <div key={index + 5}>챔피언 : {findChampion(data.championId)}</div>
                  <div key={index + 200}>숙련도 레벨 : {data.championLevel}</div>
                  <div key={index + 100}>숙련도 : {data.championPoints.toLocaleString()} Point</div>
                </div>
              ) : '';
            })  : <><div>숙련도 데이터가 모자랍니다. </div> <i>숙련도 데이터가 5개 미만입니다.</i></>}
        </div>
        <div className="summoner-mastery">
          {mastery.length === 10 ?
            mastery.map(function (data, index){
              return index > 4 ? (
                <div key={index + 10000} className="summoner-mastery-info">
                  <div key={index + 1000}>모스트 {index + 1}</div>
                  <div key={index + 5}>챔피언 : {findChampion(data.championId)}</div>
                  <div key={index + 200}>숙련도 레벨 : {data.championLevel}</div>
                  <div key={index + 100}>숙련도 : {data.championPoints.toLocaleString()} Point</div>
                </div>
              ) : '';
            })  : <><div>숙련도 데이터가 모자랍니다. </div> <i>숙련도 데이터가 5개 미만입니다.</i></>}
        </div>
      </div>
    </div>
  );
}
export default App;