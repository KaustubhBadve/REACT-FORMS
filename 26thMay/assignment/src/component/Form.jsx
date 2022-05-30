import React,{useState,useEffect} from 'react'
import style from "./Form.module.css"
import axios from 'axios'
import {v4 as uuid4} from "uuid"
const obj={
    Name:"",
    Age:"",
    Address:"",
    Department:"",
    Salary:"",
    isMarried:"",
    Profilepic:""
}



const Form = () => {

const [data, setData] = useState(obj)
const [showData, setshowData] = useState([])

const [page, setpage] = useState(1)
const [limit, setlimit] = useState(5)
const [count, setcount] = useState()

const Handledata=(e)=>{
  let {name,value,type,files,checked}=e.target


  if(type==="checkbox")
  {
      setData({...data,[name]:checked})
  }
  else if(type==="files")
  {
      setData({...data,[name]:files})
  }
  else{
    setData({...data,[name]:value})
  }
}

useEffect(() => {
  let getData=async ()=>{
       let r=await axios.get(`http://localhost:3001/EmplouyeeDetails?_page=${page}&_limit=${limit}`)
       console.log("r.data", r)
       setshowData(r.data)
       console.log("showdata",showData)
       setcount(Number(r.headers["x-total-count"]))
  }
  getData()
  
}, [page,limit])


const deleteelem=(id)=>{
     let A=showData.filter((elem)=>elem.id!==id)
     setshowData(A)

    fetch(`http://localhost:3001/EmplouyeeDetails/${id}`,{
        method:"DELETE",
        headers:{
            "content-type":"application/json"
          } 
    }).then((r)=>{
        r.json()
    }).then((d)=>{
        console.log(d)
    })
}

const HandleonSubmit=(e)=>{
    e.preventDefault()
     fetch("http://localhost:3001/EmplouyeeDetails",{
         method:"POST",
         headers:{
            "content-type":"application/json"
          },
          body:JSON.stringify(data)
     }).then((r)=>r.json())
     .then((d)=>{
         console.log(d)
         setshowData([...showData,d])
     })  

    console.log(data)
}

const FilSal=(e)=>{
    if(e.target.value=="HTL")
    {
     showData.sort((a,b)=>b.Salary-a.Salary)
     setshowData([...showData])
     console.log("HTL",showData)
    }
   else if(e.target.value==="LTH")
    {
     let LTH=showData.sort((a,b)=>a.Salary-b.Salary)
     setshowData([...LTH])
    }
}
const FilDept=(e)=>{
if(e.target.value==="Production")
{
    let newdata = showData.filter((e) => e.Department === "Production");
      setshowData([...newdata]);
}
else if(e.target.value==="PPC")
{
    let newdata = showData.filter((e) => e.Department === "PPC");
      setshowData([...newdata]);
}
else if(e.target.value==="Quality")
{
    let newdata = showData.filter((e) => e.Department === "Quality");
      setshowData([...newdata]);
}
else if(e.target.value==="SCM")
{
    let newdata = showData.filter((e) => e.Department === "SCM");
      setshowData([...newdata]);
}
}

    const {Name,Age,Address,Department,Salary,isMarried,Profilepic}=data


  return (
    <div>
       
      <select onChange={FilSal}>
          <option>Filter By Salary</option>
          <option value="HTL">High to Low</option>
          <option value="LTH">Low to High</option>
      </select>

      <select onChange={FilDept}>
          <option>Filter By Department</option>
          <option value="Production">Production</option>
          <option value="PPC">PPC</option>
          <option value="Quality">Quality</option>
          <option value="Purchase">Purchase</option>
          <option value="SCM">SCM</option>
      </select>
       <button disabled={page*limit>=count} onClick={()=>setpage(page+1)}>{`>`}</button>
       <button disabled={page<=1} onClick={()=>setpage(page-1)}>{`<`}</button>
        <div className={style.main}>
        <div>
        <form onSubmit={HandleonSubmit}>
            <label>
                Name : 
                <input type="text" value={Name} placeholder="Enter Your Name" name='Name' onChange={Handledata}/>
            </label>
            <br /><br />

            <label>
                Age : 
                <input type="number" value={Age} placeholder="Enter Your Age" name='Age' onChange={Handledata}/>
            </label>
            <br /><br />

            <label>
                Address : 
                <input type="text" value={Address} placeholder="Enter Your Address" name='Address' onChange={Handledata}/>
            </label>
            <br /><br />

            <label>
                Select Department : 
                <select name="Department" value={Department} onChange={Handledata}>
                    <option>Select Department</option>
                    <option value="Production">Production</option>
                    <option value="PPC">PPC</option>
                    <option value="Quality">Quality</option>
                    <option value="Purchase">Purchase</option>
                    <option value="SCM">SCM</option>
                </select>
            </label>
            <br /><br />

            <label>
                Salary in Rs : 
                <input type="number" value={Salary} placeholder="Enter Your Salary in Rs" name='Salary' onChange={Handledata}/>
            </label>
            <br /><br />

            <label>
                Maritial Status : 
                <input type="checkbox" checked={isMarried}  name='isMarried' onChange={Handledata}/>
            </label>
            <br /><br />
            <label>
                Upload Profile Pic : 
                <input type="file" files={Profilepic}  name='Profilepic' onChange={Handledata}/>
            </label>
            <br /><br />
            <input type="submit" className={style.subbtn}/>
        </form>
        </div>



    <div className={style.table}>
     <table>
         <thead>
             <tr>
                 <th>Name</th>
                 <th>Age</th>
                 <th>Address</th>
                 <th>Department</th>
                 <th>Salary in Rs</th>
                 <th>Maritial Status</th>
                 <th>Profile Pic</th>
                 <th>Edit</th>
             </tr>
         </thead>
         <tbody>
             {showData.map((elem)=>(
                 <tr key={elem.id}>
                     <td>{elem.Name}</td>
                     <td>{elem.Age}</td>
                     <td>{elem.Address}</td>
                     <td>{elem.Department}</td>
                     <td>{elem.Salary}</td>
                     {elem.isMarried ? <td>{"Married"}</td> : <td>{"Non Married"}</td>}
                     <td>{elem.Profilepic}</td>
                     <td><button onClick={()=>deleteelem(elem.id)}>Delete</button></td>
                 </tr>
             ))}
         </tbody>
     </table>
     </div>
    </div>
    </div>
  )
}

export default Form