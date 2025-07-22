import { imagePaths } from '../../assets/imagePaths'
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid'
import { deleteCategoryById } from '../../database/delete'
import { getAllCategories } from '../../database/select'
import { updateCategoryTitle } from '../../database/update'
import { getColumns } from './components/columns'
import CreateCategoryModal from './components/CreateCategoryModal'
import { useState } from 'react'
import { insertCategory } from '../../database/insert'
import type { typCategory } from '../../content/types'
import { v4 } from 'uuid';
import { setToast } from '../../redux/slices/toastSlice'
import { enmToastSeverity } from '../../content/enums'
import { useDispatch } from 'react-redux'
import { useRolePermissions } from '../../hook/useRolePermissions'

export default function CategoryList() {
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { permissions } = useRolePermissions();

    const handleAddCategory = (name: string) => {
        const newCategory: typCategory = {
            ID: v4(),
            title: name,
        };
        insertCategory(newCategory).then(() => {
            dispatch(setToast({
                message: `Added Successfully`,
                severity: enmToastSeverity.success,
            }));
        }).catch((error) => {
            dispatch(setToast({ message: error.message, severity: enmToastSeverity.error }));
        })
    };

    return (
        <>
            <SmartDataGrid<{ id: string; title: string }>
                getColumns={(
                    rowModesModel,
                    actions
                ) => getColumns(rowModesModel, actions, permissions)}
                getData={getAllCategories}
                updateData={updateCategoryTitle}
                deleteData={deleteCategoryById}
                mapRow={(id, cat, index) => ({ ...cat, id, no: index + 1 })}
                imageBackground={imagePaths.beans}
                slotProps={{
                    toolbar: {
                        title: "Category List",
                        showColumns: false,
                        showExport: false,
                        showAdd: true
                    },
                }}
                onAdd={() => setModalOpen(true)}
            />
            <CreateCategoryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddCategory}
            />
        </>
    );
}
