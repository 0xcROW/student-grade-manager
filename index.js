import http from 'http';
import { v4 } from 'uuid';

const port = 3000;
const grades = []

const server = http.createServer((req, res) => {
  const {method, url} = req;
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const id = url.split('/')[2];

    if (url === '/grades' && method === 'GET') {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(grades));
    } else if (url === '/grades' && method === 'POST') {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = {id: v4(), studentName, subject, grade};
      grades.push(newGrade);
      res.writeHead(201, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(newGrade));
    } else if (url.startsWith('/grades/') && method === 'PUT') {
      const { studentName, subject, grade } = JSON.parse(body);
      const gradeToUpdate = grades.find((g) => g.id === id);
      if (gradeToUpdate) {
        gradeToUpdate.studentName = studentName;
        gradeToUpdate.subject = subject;
        gradeToUpdate.grade = grade;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(gradeToUpdate));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ messasge: "Grade not found" }));
      }
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({message: 'Not found'}));
    }
  });
});

server.listen(port, ()=> {
  console.log(`Server running on http://localhost:${port}`);
})