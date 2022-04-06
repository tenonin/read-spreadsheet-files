const {google} = require('googleapis');

const DRIVE_SCOPE='https://www.googleapis.com/auth/drive'
const SHEET_SCOPE='https://www.googleapis.com/auth/spreadsheets'
const CREDENTIALS_FILE='credentials.json'

async function main(auth){
    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth })
    
    // Pegando todos os arquivos e retornando o id e nome deles
    const response = await drive.files.list({ fields: 'nextPageToken, files(id, name)',pageSize: 200});
    const files = response.data.files;
    console.log(files)

    // Dentro do drive.files.list tem como passar uma query para 
    // selecionar apenas o que voce quiser ex: pegar todos os arquivos 
    // dentro de uma pasta especifica
    // drive.files.list({ fields: 'nextPageToken, files(id, name)',pageSize: 200, q: `'${id-da-pasta}' in parents`});

    const spreadSheet = await sheets.spreadsheets.values.get({ spreadsheetId: files[0].id, range: 'Média!A:ZZZ' })
    console.log(spreadSheet.data.values)

    // Range do get é o nome da pagina + qual coluna ele começa ate
    // onde ele termina ex: nome da pagina é media e quero que ele
    // pegue todas as colunas dela
    // sheets.spreadsheets.values.get({ spreadsheetId: files[0].id, range: 'Média!A:ZZZ' })
}

(async () => {
    // escopo da lib do google
    const SCOPES = [DRIVE_SCOPE, SHEET_SCOPE];
    const KEYFILEPATH = `${__dirname}/${CREDENTIALS_FILE}`;
  
    // tentando autenticar drive
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES
    });

    await main(auth)
})()
  