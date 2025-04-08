import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { app } from "../lib/firebase";

const courseColors = {
  prj666: "#e2a762", // Yellow
  dbs501: "#3498db", // Blue
  General: "#71bc78", //
};

const getEventColor = (course) => {
  return courseColors[course] || "#8e44ad"; // Default to purple if the course isn't listed
};

export default function CalendarPage() {
  const { user } = useUser();
  const db = getFirestore(app);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Stores event details
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    course: "General",
  });
  const [editEvent, setEditEvent] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
    course: "General",
  });

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        backgroundColor: getEventColor(doc.data().course),
        borderColor: getEventColor(doc.data().course),
      }));
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Open the modal when an event is clicked
  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      date: info.event.start.toISOString().split("T")[0],
      course: info.event.extendedProps.course,
    });
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Open the add event modal
  const openAddEventModal = () => {
    setAddEventModalOpen(true);
  };

  // Close the add event modal
  const closeAddEventModal = () => {
    setAddEventModalOpen(false);
    setNewEvent({ title: "", date: "", description: "", course: "General" });
  };

  // Open the edit event modal
  const openEditEventModal = () => {
    setEditEvent({
      id: selectedEvent.id,
      title: selectedEvent.title,
      date: selectedEvent.date,
      description: selectedEvent.description,
      course: selectedEvent.course,
    });
    setEditEventModalOpen(true);
    setModalOpen(false);
  };

  // Close the edit event modal
  const closeEditEventModal = () => {
    setEditEventModalOpen(false);
    setEditEvent({
      id: "",
      title: "",
      date: "",
      description: "",
      course: "General",
    });
  };

  // Add a new event
  const handleAddEvent = async () => {
    if (!newEvent.date) {
      alert("Please select a date for the event.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "events"), {
        title: newEvent.title,
        date: newEvent.date,
        description: newEvent.description,
        course: newEvent.course,
      });
      const newEventWithId = {
        ...newEvent,
        id: docRef.id,
        backgroundColor: getEventColor(newEvent.course),
        borderColor: getEventColor(newEvent.course),
      };
      setEvents([...events, newEventWithId]);
      closeAddEventModal();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Update an event
  const handleUpdateEvent = async () => {
    try {
      const eventRef = doc(db, "events", editEvent.id);
      await updateDoc(eventRef, {
        title: editEvent.title,
        date: editEvent.date,
        description: editEvent.description,
        course: editEvent.course,
      });
      setEvents(
        events.map((event) =>
          event.id === editEvent.id
            ? {
                ...editEvent,
                backgroundColor: getEventColor(editEvent.course),
                borderColor: getEventColor(editEvent.course),
              }
            : event
        )
      );
      closeEditEventModal();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Remove an event
  const handleRemoveEvent = async () => {
    if (window.confirm("Are you sure you want to remove this event?")) {
      try {
        const eventRef = doc(db, "events", selectedEvent.id);
        await deleteDoc(eventRef);
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        closeModal();
      } catch (error) {
        console.error("Error removing event:", error);
      }
    }
  };

  return (
    <>
      <h1 className="page-header">Calendar</h1>
      {/* FullCalendar Component */}
      {user?.title === "professor" ? (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          customButtons={{
            addEventButton: {
              text: "Add Event",
              click: openAddEventModal,
            },
          }}
          headerToolbar={{
            left: "addEventButton",
            center: "title",
            right: "prev,next today",
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          events={events} // Uses the state to store events
          eventClick={handleEventClick} // Handles event click interactions
        />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "today",
            center: "title",
            right: "prev,next",
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          events={events} // Uses the state to store events
          eventClick={handleEventClick} // Handles event click interactions
        />
      )}
      {/* Modal for displaying event details */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedEvent?.title}</h2>
            <p>
              <strong>Date: </strong>
              {selectedEvent ? selectedEvent.date : ""}
            </p>
            <p>
              <strong>Details: </strong>
              {selectedEvent?.description || "No additional details."}
            </p>
            <button className="custom-button" onClick={closeModal}>
              Close
            </button>
            {user?.title === "professor" && (
              <>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={openEditEventModal}
                >
                  Edit Event
                </button>
                <button
                  className="btn btn-danger mt-2"
                  onClick={handleRemoveEvent}
                >
                  Remove Event
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Modal for adding a new event */}
      {addEventModalOpen && (
        <div className="modal-overlay" onClick={closeAddEventModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cancel-text" onClick={closeAddEventModal}>
              Cancel
            </span>
            <h2>Add New Event</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-control"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Course</label>
              <select
                className="form-control"
                value={newEvent.course}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, course: e.target.value })
                }
              >
                <option value="prj666">prj666</option>
                <option value="dbs501">dbs501</option>
                <option value="General">General</option>
              </select>
            </div>
            <button className="custom-button" onClick={handleAddEvent}>
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Modal for editing an event */}
      {editEventModalOpen && (
        <div className="modal-overlay" onClick={closeEditEventModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cancel-text" onClick={closeEditEventModal}>
              Cancel
            </span>
            <h2>Edit Event</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editEvent.title}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editEvent.date}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-control"
                value={editEvent.description}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, description: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Course</label>
              <select
                className="form-control"
                value={editEvent.course}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, course: e.target.value })
                }
              >
                <option value="prj666">prj666</option>
                <option value="dbs501">dbs501</option>
                <option value="General">General</option>
              </select>
            </div>
            <button className="btn custom-button" onClick={handleUpdateEvent}>
              Update Event
            </button>
          </div>
        </div>
      )}
    </>
  );
}
