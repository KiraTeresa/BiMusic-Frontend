// ########################################################################################
// >>> Want to place repeating code from the forms (create project/sample) in this file <<<
// ########################################################################################


// class FormService {
//     constructor() {
//         // 
//     };

//     handleChange(e) {
//         const { name, value } = e.target;
//         setForm({ ...form, [name]: value })
//     }
    
//     handleCheckboxChange(e) { // <<<<Function also in CreatSample.jsx
//         const { name, checked } = e.target;
    
//         switch (name) {
//             case "genre":
//                 setArrayValues(e.target, genreArr, setGenreArr);
//                 break;
//             case "lookingFor":
//                 setArrayValues(e.target, skillArr, setSkillArr);
//                 break;
//             case "isRemote":
//             case "addSample":
//                 setForm({ ...form, [name]: checked });
//                 break;
//             default:
//                 console.log(`No case matching ${name}, sorry.`)
//         }
//     }
    
//     setArrayValues(target, arr, setArr) { // <<<<Function also in CreatSample.jsx
//         const { name, value, checked } = target;
    
//         if (checked) {
//             setArr([...arr, value])
//             setForm({ ...form, [name]: [...arr, value] })
//         }
//         else {
//             const newArr = arr.filter(e => e !== value)
//             setArr(newArr)
//             setForm({ ...form, [name]: newArr })
//         }
//     }
// }

// const formService = new FormService();

// export default formService