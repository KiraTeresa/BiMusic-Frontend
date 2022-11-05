import React from 'react'

const Skills = ({ skillArr }) => {
  return (
    <div className="profile-posts">
      <div>{skillArr.length > 0 ? skillArr.map((el) => {
        return <p style={{ display: "block" }} key={el}>{el}</p>
      }) : <p>Add Some Skills</p>}
      </div>
    </div>
  )
}

export default Skills 