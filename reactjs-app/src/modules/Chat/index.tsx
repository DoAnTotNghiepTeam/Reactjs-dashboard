import React from 'react'
import { doc, setDoc } from "firebase/firestore";
import { Button } from 'antd';
import { db } from './libraries/firebase/initializaApp';


export default function ChatMessages() {

    const handleAddData = async () => {

        const docRef = doc(db, "tablemessage", "messagejob"); // cái tablemessage là tên collection ( tên của cái bảng), messagejob là tên document ( hay còn gọi dc là id)
        await setDoc(docRef, {   // gọi cái setDoc để thêm dữ liệu vào trong firebase ( như kiểu lưu dlieu vào bảng á)
            content: "hello job",
        });
    }

    return (
        <div>
            <Button onClick={handleAddData}>
                Add data
            </Button>
        </div>
    )


}