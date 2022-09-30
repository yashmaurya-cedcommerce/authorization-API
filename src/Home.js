import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@shopify/polaris';
import { PackageMajor } from '@shopify/polaris-icons';
import { Button } from '@shopify/polaris';
import { Select } from '@shopify/polaris';
import { Page, Card, DataTable } from '@shopify/polaris';
import { Frame, Loading } from '@shopify/polaris';
import { Spinner } from '@shopify/polaris';
import { TextField } from '@shopify/polaris';
import { ProductsMajor } from '@shopify/polaris-icons';

export default function Home(props) {

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('10');
  const [activePage, setActivePage] = useState('1');
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  var [choiceArray, setChoiceArray] = useState(Array(8).fill("1"));
  var [textArray, setTextArray] = useState(Array(8).fill(''));


  var placeholders = ['user_id', 'catalog', 'username', 'shops.email', 'shopify_plan', 'updated_at', 'created_at', 'shop_url'];

  const tableOptions = [
    { label: "Equals", value: "1" },
    { label: "Not Equals", value: "2" },
    { label: "Contains", value: "3" },
    { label: "Does Not Contains", value: "4" },
    { label: "Starts With", value: "5" },
    { label: "Ends With", value: "6" }
  ];


  var selectArray2 = Array(8).fill(1).map((item, index) => {

    return <><Select

      options={tableOptions}
      onChange={(value) => {
        var tempChoice = choiceArray;
        tempChoice[index] = value;
        setChoiceArray([...tempChoice]);
      }}
      value={choiceArray[index]}

    />
      <TextField
        placeholder={placeholders[index]}
        onChange={(value) => {
          var tempTextArray = [...textArray];
          tempTextArray[index] = value;
          // console.log(tempTextArray)
          setTextArray(tempTextArray)
        }}
        value={textArray[index]}
        autoComplete="off"
      />
    </>


  })




  const handleSelectChange = (value) => {
    setSelected(value);
    rows = [];
    setUsers([]);
  }

  var nextPage = (event) => {
    var temp = parseInt(activePage) + 1;
    temp = temp + "";
    setActivePage(temp);
    rows = [];
    setUsers([]);
  }

  var prevPage = (event) => {
    var temp = parseInt(activePage) - 1;
    temp = temp + "";
    setActivePage(temp);
    rows = [];
    setUsers([]);
  }

  const options = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
  ];


  var rows = [];
  var filteredRows = [];

  var opt = {
    method: "POST",
    headers: {
      authorization: sessionStorage.getItem('mySessionToken')
    }
  }


  useEffect(() => {
    rows = [];
    var flag = 0;
    textArray.map((item) => {
      if (item !== '') {
        flag = 1;
      }
    })
    if (flag === 0) {
      console.log("flag = " + flag)
      console.log('all fields empty')

      setLoading(true);
      setSpinner(true);

      fetch(`https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${selected}`, opt)
        .then(res => res.json())
        .then(temp => {
          // console.log(temp);
          setLoading(false);
          setSpinner(false);
          setTotalUsers(temp.data.count)

          temp.data.rows.map((item) => {
            rows.push([item.user_id, item.catalog, item.username, item.email, item.shopify_plan, item.updated_at, item.created_at, item.shop_url]);
          })
          console.log(rows);
          setUsers(rows);
        })
    }

    else {
      filteredRows = [];
      console.log("flag = " + flag)
      var tempString = "";
      setTimeout(() => {
        textArray.map((item, index) => {
          if (item !== '') {
            tempString = tempString + "&filter[" + placeholders[index] + "][" + choiceArray[index] + "]=" + item;
          }
        })

        console.log("string = " + tempString);

        if (window.controller) {
          window.controller.abort()
        }

        window.controller = new AbortController()
        var signal = window.controller.signal;

        setLoading(true);

        fetch(`https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${selected}${tempString}`, {
          method: "POST",
          signal: signal,
          headers: {
            authorization: sessionStorage.getItem('mySessionToken')
          }
        })
          .then(res => res.json())
          .then(tempFetch => {
            setLoading(false);
            setTotalUsers(tempFetch.data.count);
            tempFetch.data.rows.map((item) => {
              filteredRows.push([item.user_id, item.catalog, item.username, item.email, item.shopify_plan, item.updated_at, item.created_at, item.shop_url]);
            })
            console.log(filteredRows);
            setUsers(filteredRows);
          })



      }, 1000)
    }

  }, [selected, activePage, textArray])

  return (
    <div className='homeContainer'>

      <div className='sidebarContainer'>

        <p className='sidebarOptions'><span className='iconSpan'><Icon source={PackageMajor} color="base" /></span><span className='textSpan'>Dashboard</span></p>
        <p className='sidebarOptions'><span className='iconSpan'><Icon source={ProductsMajor} color="base" /></span><span className='textSpan'>Products</span></p>
        <p className='sidebarOptions'><span className='iconSpan'><Icon source={ProductsMajor} color="base" /></span><span className='textSpan'>Grid</span></p>

      </div>

      <div className='mainContainer'>

        <p className='mainHeading'>Data Grid</p>
        <p className='mainSubHeading'>Showing from {((parseInt(activePage) - 1) * parseInt(selected)) + 1} to {(parseInt(activePage) == Math.ceil(parseInt(totalUsers) / parseInt(selected)) ? (parseInt(totalUsers)) : (((parseInt(activePage) - 1) * parseInt(selected)) + parseInt(selected)))} of {totalUsers} users</p>


        <div className='tableContainer'>

          <div className='tableHeader'>

            <div className='paginationDiv'>
              {(parseInt(activePage) == 1) ? <Button children={'Prev'}></Button> : <Button children={'Prev'} onClick={(event) => prevPage(event)}></Button>}

              <span>{activePage}</span>

              {(parseInt(activePage) == Math.ceil(parseInt(totalUsers) / parseInt(selected))) ? <Button children={'Next'}></Button> : <Button children={'Next'} onClick={(event) => nextPage(event)}></Button>}
            </div>

            <div className='numSelectDiv'>
              <Select
                options={options}
                onChange={handleSelectChange}
                value={selected}
                placeholder='Row per page'
              />
            </div>

            <div className='viewColumnBtnDiv'>

              {/* <Button>View Columns</Button> */}
              <button className='viewColBtn'>View Columns</button>

            </div>

          </div>

        </div>

        <Page title="Sales by product">
          <Card>
            <DataTable
              columnContentTypes={[
                'text',
                'numeric',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text'
              ]}
              headings={[
                <p className='tableHeading'>UserId</p>,
                <p className='tableHeading'>Catalog</p>,
                <p className='tableHeading'>Shop Domain</p>,
                <p className='tableHeading'>Shop Email</p>,
                <p className='tableHeading'>Shop Plan Name</p>,
                <p className='tableHeading'>Updated At</p>,
                <p className='tableHeading'>Created At</p>,
                <p className='tableHeading'>Shops myshopify Domain</p>,
              ]}
              rows={[selectArray2, ...users]}

            />
          </Card>
        </Page>

        {(loading === true) ? <div style={{ height: '100px' }}>
          <Frame>
            <Loading />
          </Frame>
        </div> : ''}

        {(spinner === true) ? <Spinner accessibilityLabel="Spinner example" size="large" /> : ''}

      </div>


    </div>
  )
}
