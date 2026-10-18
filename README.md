# BOOK KEEPER TEST

## How To:

To run the test task you have a couple of options.
- `make  start`        - http://localhost:8080/
- `docker compose up`  - http://localhost:8080/
- `npm i && npm start` - http://localhost:4200/

Other commans you can find in `Makefile` or `package.json`

## Coverage:

File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
-----------------------------------|---------|----------|---------|---------|---------------------
All files                          |   66.91 |    82.19 |   53.24 |   71.92 |                     
 app                               |    45.5 |     87.8 |   56.66 |   55.35 |                     
  app.html                         |   10.84 |       50 |       0 |   15.38 | 11-66               
  app.ts                           |   79.76 |    89.74 |      85 |   76.71 | 43-47,59-64,164-171 
 app/components/book-dialog        |   72.88 |    56.66 |      30 |      75 |                     
  book-dialog.component.html       |    75.6 |       20 |       0 |   89.47 | 18,26               
  book-dialog.component.ts         |   66.66 |       75 |      60 |   53.84 | 35-44               
 app/components/filter-bar         |   63.63 |    78.57 |      20 |   64.28 |                     
  filter-bar.component.html        |   53.84 |       25 |       0 |   66.66 | 6-8                 
  filter-bar.component.ts          |   77.77 |      100 |      50 |      60 | 17-18               
 app/components/no-books           |   93.33 |      100 |   33.33 |     100 |                     
  no-books.component.html          |    91.3 |      100 |       0 |     100 |                     
  no-books.component.ts            |     100 |      100 |     100 |     100 |                     
 app/components/notification       |   78.94 |    94.73 |   28.57 |      80 |                     
  notification.component.html      |   73.33 |       50 |       0 |    87.5 | 7                   
  notification.component.ts        |     100 |      100 |     100 |     100 |                     
  notification.constant.ts         |     100 |      100 |     100 |     100 |                     
  notification.service.ts          |      50 |      100 |       0 |   33.33 | 13-25               
 app/components/title-bar-actions  |    90.9 |      100 |      25 |     100 |                     
  title-bar-actions.component.html |      88 |      100 |       0 |     100 |                     
  title-bar-actions.component.ts   |     100 |      100 |     100 |     100 |                     
 app/constants                     |     100 |      100 |     100 |     100 |                     
  book.constant.ts                 |     100 |      100 |     100 |     100 |                     
 app/imports                       |     100 |      100 |     100 |     100 |                     
  book.imports.ts                  |     100 |      100 |     100 |     100 |                     
  common.imports.ts                |     100 |      100 |     100 |     100 |                     
  material.imports.ts              |     100 |      100 |     100 |     100 |                     
 app/services                      |   89.79 |    81.81 |   88.88 |    87.8 |                     
  book.service.ts                  |   89.79 |    81.81 |   88.88 |    87.8 | 62-67,91-92              


Also coverage report can be found in the `coverage` folder after running `npm run test` command.