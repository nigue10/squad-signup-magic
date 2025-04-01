
import React from 'react';
import { TeamRegistration } from '@/types/igc';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, CheckCheck, BookCheck } from 'lucide-react';

interface StatsProps {
  teams: TeamRegistration[];
}

const AdminDashboardStats: React.FC<StatsProps> = ({ teams }) => {
  // Calculate statistics
  const totalTeams = teams.length;
  
  const secondaryTeams = teams.filter(team => team.generalInfo.category === 'Secondaire').length;
  const higherTeams = teams.filter(team => team.generalInfo.category === 'Supérieur').length;
  
  const qualifiedTeams = teams.filter(team => team.qcmQualified).length;
  const qualifiedPercentage = totalTeams > 0 ? Math.round((qualifiedTeams / totalTeams) * 100) : 0;
  
  const interviewedTeams = teams.filter(team => 
    team.status === 'Entretien réalisé' || 
    team.status === 'Sélectionné' || 
    team.status === 'Non retenu'
  ).length;
  
  const selectedTeams = teams.filter(team => team.decision === 'Sélectionné').length;
  
  // Prepare data for category distribution chart
  const categoryData = [
    { name: 'Secondaire', value: secondaryTeams, fill: '#1b1464' },
    { name: 'Supérieur', value: higherTeams, fill: '#96005d' }
  ];
  
  // Prepare data for status distribution chart
  const getStatusCount = (status: string) => teams.filter(team => team.status === status).length;
  const statusData = [
    { name: 'Inscrit', value: getStatusCount('Inscrit') },
    { name: 'QCM soumis', value: getStatusCount('QCM soumis') },
    { name: 'Qualifié', value: getStatusCount('Qualifié pour entretien') },
    { name: 'Entretien réalisé', value: getStatusCount('Entretien réalisé') },
    { name: 'Sélectionné', value: getStatusCount('Sélectionné') },
    { name: 'Non retenu', value: getStatusCount('Non retenu') }
  ];
  
  // Colors for the pie chart
  const COLORS = ['#1b1464', '#96005d', '#cc99cc', '#4CAF50', '#FFC107', '#F44336'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total équipes</CardTitle>
            <Users className="h-4 w-4 text-igc-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">
              {secondaryTeams} Secondaire, {higherTeams} Supérieur
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipes qualifiées QCM</CardTitle>
            <CheckCheck className="h-4 w-4 text-igc-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedTeams}</div>
            <p className="text-xs text-muted-foreground">
              {qualifiedPercentage}% des équipes inscrites
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entretiens réalisés</CardTitle>
            <BookCheck className="h-4 w-4 text-igc-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewedTeams}</div>
            <p className="text-xs text-muted-foreground">
              Sur {qualifiedTeams} équipes qualifiées
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipes sélectionnées</CardTitle>
            <Award className="h-4 w-4 text-igc-navy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedTeams}</div>
            <p className="text-xs text-muted-foreground">
              {interviewedTeams > 0 ? Math.round((selectedTeams / interviewedTeams) * 100) : 0}% des équipes interviewées
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>Distribution des équipes par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution par statut</CardTitle>
            <CardDescription>Nombre d'équipes à chaque étape du processus</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Équipes" fill="#1b1464" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
