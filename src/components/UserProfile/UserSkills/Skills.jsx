import React from 'react'

const Skills = ({skillArr}) => {
  return (
    <div className="profile-posts">
      <h1>Skills</h1>
      <p>{skillArr.map((el) => {
        return <p style={{ display: "block" }}>{el}</p>
      })}
      </p>
    </div>   
  )
}

export default Skills 