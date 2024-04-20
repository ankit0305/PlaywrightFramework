import { Page, expect } from '@playwright/test';
import { EffizienteBasePage } from './effizienteBasePage';
import { AnnotationType } from '../../utils/annotations/AnnotationType';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { Table } from '../../components/TableComponent';
import { Server } from '../../api/models/Effiziente/Server';
import { ServerApi } from '../../api/Effiziente/Server.api';
import { InputText } from '../../components/InputText';
import { Generic } from '../../components/Generic';

export class ServersPage extends EffizienteBasePage {
    readonly title: Heading;
    readonly add: Button;
    readonly delete: Button;
    readonly exportToExcel: Button;
    readonly table: Table;
    readonly key: InputText;
    readonly name: InputText;
    readonly url: InputText;
    readonly save: Button;
    readonly cancel: Button;
    readonly message: Generic;
    serverApi: ServerApi;

    constructor(page: Page) {
        super(page, 'Servers');
        this.title = new Heading(page, this.annotationHelper, 'Servers');
        this.add = new Button(page, this.annotationHelper, 'Add');
        this.delete = new Button(page, this.annotationHelper, 'Delete');
        this.exportToExcel = new Button(page, this.annotationHelper, 'Export to Excel');
        this.table = new Table(page, this.annotationHelper);
        this.key = new InputText(page, this.annotationHelper, '#minmax', false);
        this.name = new InputText(page, this.annotationHelper, '[placeholder="Name"]', false);
        this.url = new InputText(page, this.annotationHelper, '[placeholder="Url"]', false);
        this.save = new Button(page, this.annotationHelper, 'Save');
        this.cancel = new Button(page, this.annotationHelper, 'Cancel');
        this.message = new Generic(page, this.annotationHelper, '[data-test="message"]', 'Message');
        this.serverApi = new ServerApi(page);
    }

    /**
     * Go to servers page 
     */
    public async goTo() {
        const serversPage = this.baseURL + '/Security/servers';
        this.annotationHelper.addAnnotation(AnnotationType.GoTo, 'Go to the page: "' + serversPage + '"');
        await this.page.goto(serversPage);
        await this.title.locator.waitFor({ timeout: 30_000 });
    }

    /**
     * Create a server by api
     * @param server Data for the server
     */
    async createServer(server: Server) {
        const response = await this.serverApi.createServer(server);
        const responseText = JSON.parse(await response.text());
        const id = +responseText.Id;
        return id;
    }

    /**
     * Check the values in the row grid
     * @param key key for the server
     * @param name name for the server
     * @param url url for the server
     */
    async checkRow(key: number, name: string, url: string) {
        const row = await this.table.getRowBykey(key);
        let assertDescription = `Row with the key: ${key} exists`;
        this.addAnnotation(AnnotationType.Assert, assertDescription);
        expect(row, assertDescription).not.toBeNull();
        //Get the row values as a object the header title are the property of the object
        const rowValues = await this.table.getRowValues(row);
        assertDescription = `The server name for the key: "${key}" is: "${name}"`;
        expect(rowValues.Name, assertDescription).toBe(name);
        assertDescription = `The server urls for the key: "${key}" is: "${url}"`;
        expect(rowValues.Url, assertDescription).toBe(url);
    }

}