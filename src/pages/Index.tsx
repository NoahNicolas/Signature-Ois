
import React, { useState } from 'react';
import { Professional, Meeting } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TabNavigation from '../components/TabNavigation';
import ProfessionalsList from '../components/ProfessionalsList';
import MeetingsList from '../components/MeetingsList';
import MeetingDetail from '../components/MeetingDetail';

const Index: React.FC = () => {
  const [professionals, setProfessionals] = useLocalStorage<Professional[]>('professionals', []);
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', []);
  const [activeTab, setActiveTab] = useState<'professionals' | 'meetings'>('meetings');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Gestion des professionnels
  const handleAddProfessional = (firstName: string, lastName: string) => {
    const newProfessional: Professional = {
      id: Date.now().toString(),
      firstName,
      lastName,
      createdAt: new Date(),
    };
    setProfessionals([...professionals, newProfessional]);
  };

  const handleEditProfessional = (id: string, firstName: string, lastName: string) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, firstName, lastName } : prof
    ));
  };

  const handleDeleteProfessional = (id: string) => {
    setProfessionals(professionals.filter(prof => prof.id !== id));
    // Supprimer également le professionnel de toutes les réunions
    setMeetings(meetings.map(meeting => ({
      ...meeting,
      participants: meeting.participants.filter(p => p.professionalId !== id)
    })));
  };

  const handleImportProfessionals = (importedProfessionals: { firstName: string; lastName: string }[]) => {
    const newProfessionals: Professional[] = importedProfessionals.map(prof => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      firstName: prof.firstName,
      lastName: prof.lastName,
      createdAt: new Date(),
    }));
    setProfessionals([...professionals, ...newProfessionals]);
  };

  // Gestion des réunions
  const handleAddMeeting = (title: string, date: Date) => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title,
      date,
      participants: [],
      createdAt: new Date(),
    };
    setMeetings([...meetings, newMeeting]);
  };

  const handleEditMeeting = (id: string, title: string, date: Date) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === id ? { ...meeting, title, date } : meeting
    ));
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    if (selectedMeeting && selectedMeeting.id === id) {
      setSelectedMeeting(null);
    }
  };

  const handleOpenMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === updatedMeeting.id ? updatedMeeting : meeting
    ));
    setSelectedMeeting(updatedMeeting);
  };

  const handleBackToMeetings = () => {
    setSelectedMeeting(null);
    setActiveTab('meetings');
  };

  return (
    <Layout>
      <Header />
      
      {selectedMeeting ? (
        <MeetingDetail
          meeting={selectedMeeting}
          professionals={professionals}
          onBack={handleBackToMeetings}
          onUpdateMeeting={handleUpdateMeeting}
        />
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {activeTab === 'professionals' ? (
            <ProfessionalsList
              professionals={professionals}
              onAddProfessional={handleAddProfessional}
              onEditProfessional={handleEditProfessional}
              onDeleteProfessional={handleDeleteProfessional}
              onImportProfessionals={handleImportProfessionals}
            />
          ) : (
            <MeetingsList
              meetings={meetings}
              onAddMeeting={handleAddMeeting}
              onEditMeeting={handleEditMeeting}
              onDeleteMeeting={handleDeleteMeeting}
              onOpenMeeting={handleOpenMeeting}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default Index;
