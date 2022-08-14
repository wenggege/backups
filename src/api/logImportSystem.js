import request from '@/utils/request/index'
import download from '@/utils/request/download'
// const BASE_URL1 = process.env.VUE_APP_BASE_API
// const BASE_URL2 = process.env.VUE_APP_BASE_API2

/**
 * @description  获取进口管理平台分页信息
 */
export function importAllGetList (param) {
  return request.get('/api/ImportAndExportMain/GetList', param)
}

/**
 * @description  获取所有待接单信息
 */
export function pendingGetList (param) {
  return request.get('/api/ImportAndExportMain/GetOrderList', param)
}

/**
 * @description  新增 进口产品类型
 */
export function addImportProductType (param = {}) {
  return request.post('/api/ImportAndExportMain', param)
}

/**
 * @description  修改 进口管理平台
 */
export function editImportProductType (param = {}) {
  return request.post('/api/ImportAndExportMain/Edit', param)
}

/**
 * @description  获取详情信息
 */
export function getDetailsInfo (param) {
  return request.get('/api/ImportAndExportMain/GetModel', param)
}

/**
 * @description  供应商主数据查询
 */
export function getSupplierData (param) {
  return request.get('/restcloud/sap/mm/zmm_vender_get', param)
}

/**
 * @description  获取合同信息
 */
export function getContractMain (param) {
  return request.get('/api/Contract/GetContractMain', param)
}

/**
 * @description  保存合同信息
 */
export function saveContract (param) {
  return request.post('/api/Contract/SaveContract', param)
}

/**
 * @description  获取申报要素信息
 */
export function getDeclareMain (param) {
  return request.get('/api/Declare/GetDeclareMain', param)
}

/**
 * @description  保存申报要素信息
 */
export function saveDeclare (param) {
  return request.post('/api/Declare/SaveDeclare', param)
}

/**
 * @description  获取报关草单信息
 */
export function getDraftCustomsDeclaration (param) {
  return request.get('/api/DraftCustomsDeclaration/GetDraftCustomsDeclaration', param)
}
/**
 * @description  保存报关草单信息
 */
export function saveDraftCustomsDeclaration (param) {
  return request.post('/api/DraftCustomsDeclaration/SaveDraftCustomsDeclaration', param)
}

/**
 * @description  获取国内托书信息
 */
export function getIdomesticEntrustMain (param) {
  return request.get('/api/IdomesticEntrust/GetIdomesticEntrustMain', param)
}

/**
 * @description  保存国内托书信息
 */
export function saveIdomesticEntrust (param) {
  return request.post('/api/IdomesticEntrust/SaveIdomesticEntrust', param)
}

/**
 * @description  获取国际托书信息
 */
export function getInternationalTrusteeMain (param) {
  return request.get('/api/InternationalTrustee/GetInternationalTrusteeMain', param)
}

/**
 * @description  保存国际托书信息
 */
export function saveInternationalTrustee (param) {
  return request.post('/api/InternationalTrustee/SaveInternationalTrustee', param)
}

/**
 * @description  获取发票信息
 */
export function getInvoiceMain (param) {
  return request.get('/api/Invoice/GetInvoiceMain', param)
}

/**
 * @description  保存发票信息
 */
export function saveInvoice (param) {
  return request.post('/api/Invoice/SaveInvoice', param)
}

/**
 * @description  获取箱单信息
 */
export function getPackingListMain (param) {
  return request.get('/api/PackingList/GetPackingListMain', param)
}

/**
 * @description  保存箱单信息
 */
export function savePackingList (param) {
  return request.post('/api/PackingList/SavePackingList', param)
}

/**
 * @description  获取签收单信息
 */
export function getSignForReceiptMain (param) {
  return request.get('/api/SignForReceipt/GetSignForReceiptMain', param)
}

/**
 * @description  保存签收单信息
 */
export function saveSignForReceipt (param) {
  return request.post('/api/SignForReceipt/SaveSignForReceipt', param)
}

/**
 * @description  文件下载
 */
export function downloadFile (param) {
  return download.get('/api/Pdf/Download', param)
}

/**
 * @description  文件预览打印
 */
export function previewFile (param) {
  return download.preview('/api/Pdf/Download', param)
}
/**
 * @description  文件上传
 */
export function fileUpload (param) {
  return request.upload('/api/file/Upload', param)
}

/**
 * @description  导出EXCEL
 */
export function getExport (param) {
  return download.get('/api/ImportAndExportMain/GetExport', param)
}

/**
 * @description  根据DominId获取Token信息
 */
export function getToKenByDomainId (param) {
  return request.get('/Authentication/GetToKenByDomainId', param)
}

// 无用
export function getDomainid (param) {
  return request.get(`/account/LoginIn?redirectUrl=${param}`, '', { headers: { Accept: 'application/json;chartset=utf-8;' } })
}
