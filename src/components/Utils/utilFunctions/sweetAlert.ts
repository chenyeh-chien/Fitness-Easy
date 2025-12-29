import Swal from 'sweetalert2'
import type { SweetAlertOptions } from 'sweetalert2'

const DEFAULT_CHECK_CONFIG: SweetAlertOptions = {
  width: 400,
  title: "Are you sure to do the action?",
  showDenyButton: false,
  showCancelButton: true,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  customClass: {
    title: "swal__custom-title",
    container: "swal__custom-container",
    popup: "swal__custom-style",
    confirmButton: "swal__custom-confirm-button",
    cancelButton: "swal__custom-cancel-button"
  }
}

const DEFAULT_REPLY_CONFIG: SweetAlertOptions = {
  icon: "success",
  title: "Stopped",
  text: "The command has been stopped.",
  customClass: {
    title: "swal__custom-title",
    container: "swal__custom-container",
    popup: "swal__custom-style",
    confirmButton: "swal__custom-confirm-button",
    cancelButton: "swal__custom-cancel-button"
  }
}

export const useSweetAlert = async (
  callback: (...args: any[]) => Promise<any>,
  args: any[],
  checkConfig: SweetAlertOptions = {},
  replyConfig: SweetAlertOptions = {}
): Promise<boolean> => {
  const checkResult = await Swal.fire({
    target: document.getElementById('drawer-content-area') || 'body',
    ...DEFAULT_CHECK_CONFIG,
    ...checkConfig
  } as SweetAlertOptions);
  if (checkResult.isDismissed) return false;

  await callback(...args);
  await Swal.fire({
    target: document.getElementById('drawer-content-area') || 'body',
    ...DEFAULT_REPLY_CONFIG,
    ...replyConfig
  } as SweetAlertOptions);

  return true;
}

export const useSweetAlertAddRecord = async (
  callback: (...args: any[]) => Promise<any>,
  args: any[]
): Promise<boolean> => {
  const checkConfig: SweetAlertOptions = {
    width: 400,
    title: "Are you sure to add the record?",
  }

  const replyConfig: SweetAlertOptions = {
    title: "Added",
    text: "The record has been added.",
  }

  return await useSweetAlert(
    callback,
    args,
    checkConfig,
    replyConfig
  )
}

export const useSweetAlertUpdateRecord = async (
  callback: (...args: any[]) => Promise<any>,
  args: any[]
): Promise<boolean> => {
  const checkConfig: SweetAlertOptions = {
    width: 400,
    title: "Are you sure to update the record?",
  }

  const replyConfig: SweetAlertOptions = {
    title: "Updated",
    text: "The record has been updated.",
  }

  return await useSweetAlert(
    callback,
    args,
    checkConfig,
    replyConfig
  )
}

export const useSweetAlertDeleteRecord = async (
  callback: (...args: any[]) => Promise<any>,
  args: any[]
): Promise<boolean> => {
  const checkConfig: SweetAlertOptions = {
    width: 400,
    title: "Are you sure to delete the record?",
  }

  const replyConfig: SweetAlertOptions = {
    title: "Deleted",
    text: "The record has been deleted.",
  }

  return await useSweetAlert(
    callback,
    args,
    checkConfig,
    replyConfig
  )
}
