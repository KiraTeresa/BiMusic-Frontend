import React from 'react'

const Skills = ({ skillArr }) => {
  return (
    <div className="profile-posts">
      <h1>Skills</h1>
      <div>{skillArr.map((el) => {
        return <p style={{ display: "block" }} key={el}>{el}</p>
      })}
      </div>
    </div>
  )
}

export default Skills 