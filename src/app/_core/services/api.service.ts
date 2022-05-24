import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { IpDto } from '../domains/objects/ip.dto';
import { ApiUrl } from '../helpers/api.url.helper';
import { FileType } from '../domains/enums/file.type';
import { TableData } from '../domains/data/table.data';
import { ResultApi } from '../domains/data/result.api';
import { UploadData } from '../domains/data/upload.data';
import { MethodType } from '../domains/enums/method.type';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { UserLoginDto, UserProfileDto, UserRegisterDto, UserResetPasswordDto } from '../domains/objects/user.dto';

@Injectable()
export class ApiService {

    constructor(protected http: HttpClient) {
    }

    async ip() {
        return await this.http
            .get('//ipinfo.io/json')
            .toPromise()
            .then((c: any) => {
                return ResultApi.ToEntity(IpDto.ToEntity(c));
            })
            .catch(async e => {
                return await this.http
                    .get('//ip-api.com/json/')
                    .toPromise()
                    .then((c: any) => {
                        return ResultApi.ToEntity(IpDto.ToEntity(c));
                    })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            });
    }
    async items(obj?: TableData, url?: string) {
        if (!url) url = '/' + obj.Name.toLowerCase() + '/items';
        if (!obj) {
            obj = {
                Paging: {
                    Index: 1,
                    Size: 100
                }
            };
        }
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async lookup(url: string, columns?: string[], by?: any, search: string = null, pageIndex: number = 1, pageSize: number = 2000) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (by) api = api + '/' + by;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1)
            api = api + "?properties=" + columns.join(';');
        if (search) api = api + '&search=' + search;
        if (pageSize) api = api + '&pageSize=' + pageSize;
        if (pageIndex) api = api + '&pageIndex=' + pageIndex;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lookupDateTime(url: string, columns?: string[], by?: any, search: string = null, pageIndex: number = 1, pageSize: number = 2000) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (by) api = api + '/' + by;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1)
            api = api + "?properties=" + columns.join(';');
        api = api + '&datetime=true';
        if (search) api = api + '&search=' + search;
        if (pageSize) api = api + '&pageSize=' + pageSize;
        if (pageIndex) api = api + '&pageIndex=' + pageIndex;
        return await this.ToResultApi(api, MethodType.Get);
    }

    async notifies(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/notify/mynotifies');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async licences(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/licence');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async companies(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/company');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async linkPermissions(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/linkpermission');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async profile(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/profile');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async verify(code: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/verify/' + code);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async checkVerify(code: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/verify/' + code);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async signin(obj: UserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/signin');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async signout(obj: UserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/signout');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async resetPassword(email: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/resetPassword');
        let obj = {
            Email: email,
        };
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async register(obj: UserRegisterDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/register', [
        ]);
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async updateProfile(obj: UserProfileDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/updateprofile');
        let param = {
            Phone: obj.Phone,
            Avatar: obj.Avatar,
            Birthday: obj.Birthday,
            LastName: obj.LastName,
            FirstName: obj.FirstName,
        };
        return await this.ToResultApi(api, MethodType.Post, param);
    }
    async changePassword(obj: UserResetPasswordDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/security/changePassword');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async upload(url: string, item: UploadData) {
        let fd = new FormData(),
            result: ResultApi = null,
            type = item.type == FileType.Image ? 'image' : 'file',
            api = ApiUrl.ToUrl(url);

        fd.append(type, item.data);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200 || xhr.status == 201)
                    result = <ResultApi>JSON.parse(xhr.responseText);
                else result = ResultApi.ToException(xhr.responseText);
            }
        }
        if (item.processFunction) {
            xhr.onprogress = (e) => {
                const percent = Math.round((e.loaded / e.total) * 100);
                item.processFunction(percent);
            }
        }
        if (item.completeFunction) {
            xhr.onload = (e) => {
                item.completeFunction(result);
            }
        }
        if (item.failFunction) {
            xhr.onerror = (e) => {
                item.failFunction(e);
            }
        }
        if (item.cancelFunction) {
            xhr.onabort = (e) => {
                item.cancelFunction(e);
            }
        }
        xhr.open("POST", api, false);
        xhr.send(fd);
    }
    public downloadFile(objName: string, obj?: TableData): Observable<HttpEvent<Blob>> {
        let token = this.getToken();
        const api = ApiUrl.ToUrl('/admin/' + objName.toLowerCase() + '/export');
        return this.http.request(new HttpRequest('POST', api, obj,
            {
                headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
                responseType: 'blob',
                reportProgress: true,
            }));
    }

    async users(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/user/users');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async accounts(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/user/accounts');
        return await this.ToResultApi(api, MethodType.Get);
    }

    private getToken() {
        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
        if (json) {
            let raw = JSON.parse(json);
            return raw && raw.Token;
        } return null;
    }
    private getHeaders() {
        let token = this.getToken();
        return token
            ? {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
            }
            : {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
            };
    }
    protected async ToResultApi(api: string, type: MethodType = MethodType.Get, params: any = null, headers: any = null): Promise<ResultApi> {
        headers = headers || this.getHeaders();
        switch (type) {
            case MethodType.Get: {
                return await this.http
                    .get(api, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Put: {
                return await this.http
                    .put(api, params, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Post: {
                return await this.http
                    .post(api, params, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Delete: {
                return await this.http
                    .delete(api, headers)
                    .toPromise()
                    .then(c => ResultApi.ToObject(c))
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
        }
    }
}
