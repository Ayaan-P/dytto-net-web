import type { Relationship, Interaction, User } from '../types';

export interface ExportData {
  user: User;
  relationships: Relationship[];
  interactions: Interaction[];
  exportDate: string;
  version: string;
}

export function exportUserData(
  user: User,
  relationships: Relationship[],
  interactions: Interaction[]
): ExportData {
  return {
    user,
    relationships,
    interactions,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(relationships: Relationship[]): string {
  const headers = ['Name', 'Level', 'XP', 'Categories', 'Last Interaction', 'Created Date'];
  
  const rows = relationships.map(rel => [
    rel.name,
    rel.level.toString(),
    rel.xp.toString(),
    rel.categories.map(c => c.name).join('; '),
    rel.lastInteraction?.toISOString() || 'Never',
    rel.createdAt.toISOString(),
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}