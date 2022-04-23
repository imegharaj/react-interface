import { useEffect, useState, useCallback } from 'react';
import { BiArchive } from 'react-icons/bi'
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from './components/AppointmentInfo'

function App() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState('');
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("petName");

  const fetchData = useCallback(() => {
      fetch("./data.json")
          .then(response => response.json())
          .then(data => {
              setAppointmentList(data);
          })
  }, []);

  const filteredAppointments = appointmentList.filter(item => {
      return (
          item.petName.toLowerCase().includes(query.toLowerCase()) ||
          item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
          item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
  }).sort((a,b) => {
      let order = (orderBy === "asc") ? 1 : -1;
      return (
          a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
      )
  })

  useEffect(() => {
      fetchData();
  }, [fetchData])

  return (
    <div className="App mx-auto mt-3 font-thin p-5">
      <h1 className="text-5xl">
          <BiArchive className="inline-block text-red-400 align-top"/>
          Your Appointments
      </h1>
        <AddAppointment onFormSubmitted={(appointment) => setAppointmentList([...appointmentList, appointment])}
                        lastId={appointmentList.filter((max, item) => item.id > max ? item.id : max, 0)}/>
        <Search query={query}
                onQueryChange={ searchQuery => setQuery(searchQuery) }
                orderBy={orderBy}
                onOrderByChange={searchOrder => setOrderBy(searchOrder)}
                sortBy={sortBy}
                onSortByChange={bySort => setSortBy(bySort)}
        />
        <ul className="divide-y divide-gray-200">
            {
                filteredAppointments.map(appointment => (
                    <AppointmentInfo
                        key={appointment.id}
                        appointment={appointment}
                        onDeleteItemClick={
                        appointmentId => setAppointmentList(
                            appointmentList.filter(appointment => appointment.id !== appointmentId)
                            )
                        }
                    />
                ))
            }
        </ul>
    </div>
  );
}

export default App;
