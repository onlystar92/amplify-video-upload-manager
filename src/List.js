import React, {useEffect, useState} from "react";
import {Storage} from "@aws-amplify/storage";
import {keys} from "@material-ui/core/styles/createBreakpoints";

function List(itemList) {
  console.log(itemList);

  const handleOnClick = async (key) => {
    console.log('clicked', key);
    const signedURL = await Storage.get(key); // get key from Storage.list
    console.log(signedURL);
  }

  const content = (
    <ul>
      {itemList.data.map((item) =>
        <li key={item.key} onClick={() => handleOnClick(item.key)}>
          {item.key}
        </li>
      )}
    </ul>
  );

  return(
    <div>
      <ul>
          <ul>
            {itemList && content}
          </ul>
      </ul>
    </div>
  )
}
export default List;