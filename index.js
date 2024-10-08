import http from 'http';
import { v4 } from 'uuid';

const port = 3000;
const grades = []

const server = http.createServer((req, res) => {
  const {method, url} = req;
  let body = '';

  //This will add to body everything that will come in the further requests, since body was set globally right above
  req.on('data', chunk => {
    body += chunk.toString();
  });

  //This will take the URL and split it in two parts, save globally what comes after / in a constant
  req.on('end', () => {
    const id = url.split('/')[2];

    //CRUD routes
    //GET
    if (url === '/grades' && method === 'GET') {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(grades));
    } 
    //POST
    else if (url === '/grades' && method === 'POST') {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = {id: v4(), studentName, subject, grade};
      grades.push(newGrade);
      res.writeHead(201, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(newGrade));
    } 
    //PUT
    else if (url.startsWith('/grades/') && method === 'PUT') {
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
    }
    //DELETE
    else if (url.startsWith('/grades/') && method === 'DELETE') {
      const index = grades.findIndex((g) => g.id === id);
      if (index !== -1) {
        grades.splice(index, 1);
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({message: 'Not found'}));
    }
  });
});

//Server start
server.listen(port, ()=> {
  console.log(`Server running on http://localhost:${port}`);
})