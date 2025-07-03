import { imagePaths } from '../../assets/imagePaths'
import SmartDataGrid from '../../components/smartDataGrid/SmartDataGrid'
import { deleteCategoryById } from '../../database/delete'
import { getAllCategories } from '../../database/select'
import { updateCategoryTitle } from '../../database/update'
import { getColumns } from './components/columns'

export default function CategoryList() {
    return (
        <SmartDataGrid<{ id: string | number; title: string }>
            getColumns={getColumns}
            getData={getAllCategories}
            updateData={updateCategoryTitle}
            deleteData={deleteCategoryById}
            mapRow={(id, cat, index) => ({
                id: id,
                no: index + 1, // 👈 only for display, not saved
                title: cat.title,
            })}
            imageBackground={imagePaths.beans}
            slotProps={{
                toolbar: {
                    title: "Category List",
                    showColumns: false,
                    showExport: false,
                    showAdd: true
                },
            }}
            createRow={(newId) => ({
                id: newId,
                title: '',
                no: -1,
            })}
        />
    );
}
