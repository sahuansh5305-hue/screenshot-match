export const blocks = ["Sagar", "Banda", "Khurai", "Bina", "Rehli", "Deori", "Naryaoli", "Surkhi"];

export type Member = {
  id: string; name: string; designation: string; unit: string; phone: string;
  status: "Active" | "Inactive" | "Pending"; joined: string;
};

const first = ["Ramesh", "Sunita", "Anil", "Kavita", "Mahesh", "Pooja", "Rajendra", "Seema", "Vikas", "Neha", "Dinesh", "Asha", "Suresh", "Meena", "Arvind", "Rekha"];
const last = ["Patel", "Yadav", "Tiwari", "Sharma", "Ahirwar", "Lodhi", "Jain", "Rajput"];
const desig = ["Block President", "Mandal Secretary", "Booth Coordinator", "Youth Wing Head", "Mahila Morcha Head", "Booth Coordinator", "Karyakarta", "Karyakarta"];
const statuses: Member["status"][] = ["Active", "Active", "Active", "Pending", "Inactive"];

export const members: Member[] = Array.from({ length: 32 }, (_, i) => ({
  id: `CJP-SGR-${String(1001 + i)}`,
  name: `${first[i % 16]} ${last[(i * 3) % 8]}`,
  designation: desig[i % 8]!,
  unit: blocks[i % 8]!,
  phone: `+91 9${String(800000000 + i * 7919).slice(0, 9)}`,
  status: statuses[i % 5]!,
  joined: `20${19 + (i % 7)}-0${1 + (i % 9)}-1${i % 9}`,
}));

export const tasks = [
  { id: 1, title: "Booth committee verification – Ward 12", unit: "Sagar", owner: "Ramesh Patel", due: "2026-10-25", status: "Overdue", priority: "High" },
  { id: 2, title: "Voter outreach door-to-door drive", unit: "Bina", owner: "Kavita Sharma", due: "2026-10-28", status: "In progress", priority: "High" },
  { id: 3, title: "Submit monthly block report", unit: "Khurai", owner: "Anil Yadav", due: "2026-10-30", status: "To do", priority: "Medium" },
  { id: 4, title: "Update member contact records", unit: "Rehli", owner: "Seema Rajput", due: "2026-11-02", status: "To do", priority: "Low" },
  { id: 5, title: "Organise youth wing meeting", unit: "Deori", owner: "Vikas Lodhi", due: "2026-10-22", status: "Done", priority: "Medium" },
  { id: 6, title: "Appoint Mandal secretaries", unit: "Banda", owner: "Mahesh Tiwari", due: "2026-11-05", status: "In progress", priority: "High" },
  { id: 7, title: "Collect booth-level feedback", unit: "Surkhi", owner: "Neha Jain", due: "2026-11-08", status: "To do", priority: "Medium" },
];

export const events = [
  { id: 1, title: "District Karyakarta Sammelan", date: "2026-10-27", place: "Sagar, Town Hall", expected: 850, rsvp: 612 },
  { id: 2, title: "Mahila Morcha Samvad", date: "2026-10-31", place: "Bina Community Centre", expected: 300, rsvp: 214 },
  { id: 3, title: "Block Presidents Review", date: "2026-11-03", place: "District Office, Sagar", expected: 12, rsvp: 11 },
  { id: 4, title: "Youth Rally – Khurai", date: "2026-11-09", place: "Khurai Stadium", expected: 1200, rsvp: 540 },
];

export const activity = [
  "Kavita Sharma marked 48 households visited in Bina",
  "New member Pooja Ahirwar added to Rehli block",
  "Booth 114 (Sagar) verification approved",
  "Vikas Lodhi completed ‘Organise youth wing meeting’",
  "Mandal list for Banda updated by Mahesh Tiwari",
];

export const blockStats = blocks.map((b, i) => ({
  block: b, booths: 180 + i * 23, covered: 120 + ((i * 37) % 90), members: 1400 + i * 311,
}));
