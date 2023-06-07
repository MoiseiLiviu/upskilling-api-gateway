/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "category";

export interface GetAllCategoriesRequest {
}

export interface GetAllCategoriesResponse {
  categories: CategoryPayload[];
}

export interface CategoryPayload {
  id: number;
  name: string;
  description: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  status: number;
  error: string;
  categoryId: number;
}

export const CATEGORY_PACKAGE_NAME = "category";

export interface CategoryServiceClient {
  createCategory(request: CreateCategoryRequest): Observable<CreateCategoryResponse>;

  getAll(request: GetAllCategoriesRequest): Observable<GetAllCategoriesResponse>;
}

export interface CategoryServiceController {
  createCategory(
    request: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> | Observable<CreateCategoryResponse> | CreateCategoryResponse;

  getAll(
    request: GetAllCategoriesRequest,
  ): Promise<GetAllCategoriesResponse> | Observable<GetAllCategoriesResponse> | GetAllCategoriesResponse;
}

export function CategoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createCategory", "getAll"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CategoryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CategoryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CATEGORY_SERVICE_NAME = "CategoryService";
