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
import { AdminUserLoginDto, AdminUserProfileDto, UserChangePasswordDto, UserForgotPasswordDto, UserLoginDto, UserRegisterDto } from '../domains/objects/user.dto';

@Injectable()
export class AdminApiService {

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

    export(obj?: TableData) {
        if (!obj) {
            obj = {
                Paging: {
                    Index: 1,
                    Size: 1000
                }
            };
        }
        const api = ApiUrl.ToUrl('/admin/' + obj.Name.toLowerCase() + '/export');
        return this.http.post(api, obj, this.getHeaders()).toPromise();
    }
    async callApi(controller: string, action: string, obj: any = null, method: MethodType = MethodType.Get) {
        let url = controller;
        if (action) url += '/' + action;
        const api = ApiUrl.ToUrl('/admin/' + url);
        return await this.ToResultApi(api, method, obj);
    }
    async save(objName: string, obj: any) {
        let method = obj.Id ? MethodType.Put : MethodType.Post;
        const api = ApiUrl.ToUrl('/admin/' + objName);

        if (obj) {
            delete obj.Active;
            delete obj.Deleted;
            delete obj.CreatedBy;
            delete obj.CreatedDate;
            delete obj.UpdatedBy;
            delete obj.UpdatedDate;
        }
        return await this.ToResultApi(api, method, obj);
    }
    async item(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async trash(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/trash/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async active(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/active/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async delete(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async items(obj?: TableData, url?: string) {
        if (!obj) {
            obj = {
                Paging: {
                    Index: 1,
                    Size: 100
                }
            };
        }
        if (!url)
            url = '/admin/' + obj.Name.toLowerCase() + '/items';            
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async trashVerify(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/trashVerify/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async exists(url: string, property: string, objId?: number, objExists?: any): Promise<ResultApi> {
        if (objExists) {
            if (url.indexOf('/') == 0)
                url = url.substr(1);
            let api = url.indexOf('/admin') >= 0
                ? ApiUrl.ToUrl(url)
                : ApiUrl.ToUrl('/admin/' + url);
            if (objId) api = api + '/' + objId;
            if (objExists) api = api + '?property=' + property;
            if (objExists) api = api + '&value=' + objExists;
            return await this.ToResultApi(api);
        } return ResultApi.ToFail('Invalid parameters');
    }
    async lookup(url: string, columns?: string[], by?: any, useQueryParms: boolean = false, search: string = null, pageIndex: number = 1, pageSize: number = 2000) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (by) api = api + (useQueryParms ? '?' : '/') + by;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1)
            api = api + (api.indexOf('?') >= 0 ? '&' : '?') + "properties=" + columns.join(';');
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
        const api = ApiUrl.ToUrl('/admin/notify/mynotifies');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async permissions(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/permissions');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async linkPermissions(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/linkpermissions');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async rolePermissions(roleId: number): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/rolePermission/permissions/' + roleId);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async profile(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/profile');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async checkVerify(code: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/verify/' + code);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async resetPassword(email: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/resetPassword');
        let obj = {
            Email: email,
        };
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async verify(code: string, password): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/verify/' + code);
        let obj = {
            Password: password
        }
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async updateProfile(obj: AdminUserProfileDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/updateprofile');
        let param = {
            Phone: obj.Phone,
            Avatar: obj.Avatar,
            Birthday: obj.Birthday,
            FullName: obj.FullName,
        };
        return await this.ToResultApi(api, MethodType.Post, param);
    }

    
    async signin(obj: UserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/signin');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async signout(obj: UserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/signout');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async register(obj: UserRegisterDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/register');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async changePassword(obj: UserChangePasswordDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/changePassword');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async forgotPassword(obj: UserForgotPasswordDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/forgotPassword');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async adminSignin(obj: AdminUserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/adminSignin');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async adminSignout(obj: AdminUserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/security/adminSignout');
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

    protected getToken() {
        let json = sessionStorage.getItem(AppConfig.AdminAccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AdminAccountTokenKey);
        if (json) {
            let raw = JSON.parse(json);
            return raw && raw.Token;
        } return null;
    }
    protected getHeaders() {
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
