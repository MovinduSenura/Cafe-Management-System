import React, { useState, useEffect } from "react"; 
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button
} from "reactstrap";
import "./Book.css";

import Table from "./Table";

const Book = () => {
  const [totalTables, setTotalTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [isAvailableSelected, setIsAvailableSelected] = useState(true); // State to track if "Available" is selected

  // User's selections
  const [selection, setSelection] = useState({
    table: {
      name: null,
      id: null
    },
    date: new Date(),
    time: null,
    location: "Any Location",
    size: 0
  });

  // User's booking details
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // List of potential locations
  const [locations] = useState(["Any Location", "Patio", "Inside", "Bar"]);
  const [times] = useState([
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM"
  ]);
  // Basic reservation "validation"
  const [reservationError, setReservationError] = useState(false);

  const getDate = _ => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const date =
      months[selection.date.getMonth()] +
      " " +
      selection.date.getDate() +
      " " +
      selection.date.getFullYear();
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
    console.log(time);
    const datetime = new Date(date + " " + time);
    return datetime;
  };

  const getEmptyTables = _ => {
    console.log(totalTables);
    let tables = totalTables.filter(table => table.isAvailable);
    console.log(tables);
    return tables.length;
  };

  useEffect(() => {
    // Check availability of tables from DB when a date and time is selected
    if (selection.time && selection.date) {
      (async _ => {
        let datetime = getDate();
        let res = await fetch("http://localhost:8000/table", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: datetime
          })
        });
        res = await res.json();

        console.log(res);
        // Filter available tables with location and group size criteria
        let tables = res.tables.filter(
          table =>
            (selection.size > 0 ? table.capacity >= selection.size : true) &&
            (selection.location !== "Any Location"
              ? table.location === selection.location
              : true)
        );

        console.log(tables);
        setTotalTables(tables);
        filterTables(isAvailableSelected); // Filter tables initially based on the default availability selection
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.time, selection.date, selection.size, selection.location]);

  // Make the reservation if all details are filled out
  const reserve = async _ => {
    if (
      (booking.name.length === 0) |
      (booking.phone.length === 0) |
      (booking.email.length === 0) ||
      !selection.time ||
      !selection.date ||
      !selection.table.id
    ) {
      alert("Please fill out all of the details."); // Alert if any details are missing
      console.log("Incomplete Details");
      setReservationError(true);
    } else if (!validateEmail(booking.email)) {
      alert("Please enter a valid email address."); // Alert if email format is invalid
      setReservationError(true);
    } else {
      const datetime = getDate();
      await fetch("http://localhost:8000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...booking,
          date: datetime,
          table: selection.table.id
        })
      }).then((res) => {

        res = res.text();
        alert("Reservation booked")
        console.log("Reserved: " + res);
        //TODO: navigate to nbext page
        console.log("Navigatin...");

        return;
      }).catch((err) => {
        alert("Error: " + err)
        return
      })
    }
  };

  // Email validation function
  const validateEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Clicking on a table sets the selection state
  const selectTable = (table_name, table_id) => {
    setSelection({
      ...selection,
      table: {
        name: table_name,
        id: table_id
      }
    });
  };

  // Generate party size dropdown
  const getSizes = _ => {
    let newSizes = [];

    for (let i = 1; i < 8; i++) {
      newSizes.push(
        <DropdownItem
          key={i}
          className="booking-dropdown-item"
          onClick={e => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              size: i
            };
            setSelection(newSel);
          }}
        >
          {i}
        </DropdownItem>
      );
    }
    return newSizes;
  };

  // Generate locations dropdown
  const getLocations = _ => {
    let newLocations = [];
    locations.forEach(loc => {
      newLocations.push(
        <DropdownItem
          key={loc}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              location: loc
            };
            setSelection(newSel);
          }}
        >
          {loc}
        </DropdownItem>
      );
    });
    return newLocations;
  };

  // Generate locations dropdown
  const getTimes = _ => {
    let newTimes = [];
    times.forEach(time => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              time: time
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });
    return newTimes;
  };

  // Filter tables based on availability status
  const filterTables = isAvailable => {
    let filteredTables;
    if (isAvailable) {
      filteredTables = totalTables.filter(table => table.isAvailable);
    } else {
      filteredTables = totalTables.filter(table => !table.isAvailable);
    }
    setFilteredTables(filteredTables);
  };

  // Handle click on "Available" and "Unavailable" labels
  const handleTableFilter = isAvailable => {
    filterTables(isAvailable);
    setIsAvailableSelected(isAvailable); // Update state based on the clicked button
  };

  // Generating tables from filtered tables
  const getTables = _ => {
    console.log("Getting tables");
    if (filteredTables.length > 0) {
      let tables = [];
      filteredTables.forEach(table => {
        console.log(table);
        if (table.isAvailable) {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              empty
              selectTable={selectTable}
            />
          );
        } else {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              selectTable={selectTable}
            />
          );
        }
      });
      return tables;
    }
  };

  return (
    <div className="bookingContainer">
      
      <Row noGutters className="text-center align-items-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            {!selection.table.id ? "Book a Table" : "Confirm Reservation"}
            <i
              className={
                !selection.table.id
                  ? "fas fa-chair pizza-slice"
                  : "fas fa-clipboard-check pizza-slice"
              }
            ></i>
          </p>
          <p className="selected-table">
            {selection.table.id
              ? "You are booking table " + selection.table.name
              : null}
          </p>

          {reservationError ? (
            <p className="reservation-error">
              * Please fill out all of the details.
            </p>
          ) : null}
        </Col>
      </Row>

      {!selection.table.id ? (
        <div id="reservation-stuff">
          <Row noGutters className="text-center align-items-center">
            <Col xs="12" sm="3">
              <input
                type="date"
                required="required"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => {
                  if (!isNaN(new Date(new Date(e.target.value)))) {
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date(e.target.value)
                    };
                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date()
                    };
                    setSelection(newSel);
                  }
                }}
              ></input>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Select a Time" : selection.time}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getLocations()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size === 0
                    ? "Select a Party Size"
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getSizes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row noGutters className="tables-display">
            <Col>
              {getEmptyTables() > 0 ? (
                <p className="available-tables">{getEmptyTables()} available</p>
              ) : null}

              {selection.date && selection.time ? (
                getEmptyTables() > 0 ? (
                  <div>
                    <div className="table-key">
                      <Button
                        className={`available-btn ${isAvailableSelected ? "selected" : ""}`}
                        onClick={() => handleTableFilter(false)} // Changed to filter unavailable tables
                      >
                        Unavailable
                      </Button>
                      <Button
                        className={`unavailable-btn ${!isAvailableSelected ? "selected" : ""}`}
                        onClick={() => handleTableFilter(true)} // Changed to filter available tables
                      >
                        Available
                      </Button>
                    </div>
                    <Row noGutters>{getTables()}</Row>
                  </div>
                ) : (
                  <p className="table-display-message">No Available Tables</p>
                )
              ) : (
                <p className="table-display-message">
                  Please select a date and time for your reservation.
                </p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-reservation-stuff">
          <Row
            noGutters
            className="text-center justify-content-center reservation-details-container"
          >
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Name"
                className="reservation-input"
                value={booking.name}
                onChange={e => {
                  setBooking({
                    ...booking,
                    name: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Phone Number"
                className="reservation-input"
                value={booking.phone}
                onChange={e => {
                  setBooking({
                    ...booking,
                    phone: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Email"
                className="reservation-input"
                value={booking.email}
                onChange={e => {
                  setBooking({
                    ...booking,
                    email: e.target.value
                  });
                }}
              />
            </Col>
          </Row>
          <Row noGutters className="text-center">
            <Col>
              <Button
                color="none"
                className="book-table-btn"
                onClick={_ => {
                  reserve();
                }}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>
      )}

    </div>
  );
};


export default Book;
