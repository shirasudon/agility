// @format

import axios from 'axios'

let axiosObj = axios.create({})

export class HttpService {
  setAdapter(adapter) {
    axiosObj = axios.create({
      adapter,
    })
  }
  get axios() {
    return axiosObj
  }
}

const httpService = new HttpService()

export default httpService
