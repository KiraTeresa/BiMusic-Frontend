import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import apiClient from '../../services/apiClient';
import UserInfo from '../../components/UserProfile/UserInfo';

const InitiatorProfile = () => {
  let params = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userProject, setUserProject] = useState(null);
  const [userSample, setUserSample] = useState([]);

  useEffect(() => {
    apiClient.get(`/initiator/${params.initiator}`)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  useEffect(() => {
    apiClient
      .get(`/profile/addedproject/${params.initiator}`)
      .then(response => {
        setUserProject(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  useEffect(() => {
    apiClient.get(`/samples/${params.initiator}`)
      .then(response => {
        setUserSample(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);


  return (
    <>
      {userInfo &&
        <UserInfo userInfo={userInfo} userProject={userProject} userSample={userProject} />
      }
    </>
  )
}

export default InitiatorProfile